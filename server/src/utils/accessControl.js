export async function getUniversityForUser(db, userId) {
  return db.get('SELECT * FROM universities WHERE user_id = ?', [userId]);
}

export async function canAccessStudent(db, user, student) {
  if (!student) return false;

  if (user.role === 'student') {
    return student.user_id === user.userId;
  }

  if (user.role === 'university') {
    const university = await getUniversityForUser(db, user.userId);
    return Boolean(university && university.name === student.university);
  }

  if (user.role === 'company') {
    return true;
  }

  return false;
}

export async function getScopedUniversityName(db, user) {
  if (user.role !== 'university') return null;
  const university = await getUniversityForUser(db, user.userId);
  return university?.name || null;
}
