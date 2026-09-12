import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function signup(req, res) {
  try {
    const { email, password, role, name, university, course, year, industry, size } = req.body;

    if (!email || !password || !role || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, role, and name are required' });
    }

    if (!['student', 'university', 'company'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'u-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    await db.run(
      'INSERT INTO users (id, email, password_hash, role, name, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, role, name, defaultAvatar]
    );

    let roleData = {};

    if (role === 'student') {
      const studentId = 'st-' + Date.now();
      const studentUniv = university || 'KIET GROUP OF INSTITUTIONS';
      const studentCourse = course || 'Computer Science and Engineering';
      const studentYear = parseInt(year) || 1;
      const defaultSkills = JSON.stringify(['JavaScript', 'Problem Solving']);

      await db.run(
        `INSERT INTO students (id, user_id, name, email, university, course, year, gpa, skills, avatar) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [studentId, userId, name, email, studentUniv, studentCourse, studentYear, 3.5, defaultSkills, defaultAvatar]
      );
      roleData = { id: studentId, university: studentUniv, course: studentCourse, year: studentYear, gpa: 3.5 };
    } else if (role === 'university') {
      const univId = 'univ-' + Date.now();
      await db.run(
        'INSERT INTO universities (id, user_id, name, email) VALUES (?, ?, ?, ?)',
        [univId, userId, name, email]
      );
      roleData = { id: univId };
    } else if (role === 'company') {
      const compId = 'comp-' + Date.now();
      const compIndustry = industry || 'Technology';
      const compSize = size || '100-500 employees';
      await db.run(
        'INSERT INTO companies (id, user_id, name, email, industry, size) VALUES (?, ?, ?, ?, ?, ?)',
        [compId, userId, name, email, compIndustry, compSize]
      );
      roleData = { id: compId, industry: compIndustry, size: compSize };
    }

    const token = generateToken({ userId, email, role, name });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: userId,
        email,
        role,
        name,
        avatar: defaultAvatar,
        ...roleData
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to register user' });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ success: false, error: `This account is not registered as a ${role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    let roleDetails = {};
    if (user.role === 'student') {
      const student = await db.get('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (student) {
        roleDetails = {
          studentId: student.id,
          university: student.university,
          course: student.course,
          year: student.year,
          gpa: student.gpa,
          skills: JSON.parse(student.skills || '[]')
        };
      }
    } else if (user.role === 'company') {
      const company = await db.get('SELECT * FROM companies WHERE user_id = ?', [user.id]);
      if (company) {
        roleDetails = {
          companyId: company.id,
          industry: company.industry,
          size: company.size
        };
      }
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role, name: user.name });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        ...roleDetails
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to authenticate user' });
  }
}

export async function getMe(req, res) {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, email, role, name, avatar, created_at FROM users WHERE id = ?', [req.user.userId]);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let extra = {};
    if (user.role === 'student') {
      const student = await db.get('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (student) {
        extra = {
          studentId: student.id,
          university: student.university,
          course: student.course,
          year: student.year,
          gpa: student.gpa,
          skills: JSON.parse(student.skills || '[]')
        };
      }
    } else if (user.role === 'company') {
      const company = await db.get('SELECT * FROM companies WHERE user_id = ?', [user.id]);
      if (company) {
        extra = {
          companyId: company.id,
          industry: company.industry,
          size: company.size
        };
      }
    }

    return res.json({
      success: true,
      user: {
        ...user,
        ...extra
      }
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
}
