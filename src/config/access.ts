// List of authorized emails who have purchased lifetime access
export const PAID_EMAILS: string[] = [
  "admin@dealpack.com",
"aslam@gmail.com",
   // Add your own email here for testing
  // When a Pakistani client pays 50 USD / PKR, add their email here
];

export const checkAccess = (email: string): boolean => {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return PAID_EMAILS.some((e) => e.toLowerCase() === cleanEmail);
};
