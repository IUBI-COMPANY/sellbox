interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Débil", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Regular", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Buena", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Fuerte", color: "bg-green-500" };
  return { score: 5, label: "Muy fuerte", color: "bg-emerald-400" };
};
