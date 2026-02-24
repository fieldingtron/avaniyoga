const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SPAM_PATTERNS = [
  /\b(crypto|bitcoin|forex|casino|poker|viagra|cialis)\b/i,
  /\b(loan approval|make money fast|work from home)\b/i,
  /(https?:\/\/|www\.)\S+/gi,
];

function isValidContactPayload(payload = {}) {
  const { name, email, message } = payload;
  if (!name || !email || !message) return false;
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') return false;

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  return (
    trimmedName.length >= 2 &&
    trimmedName.length <= 80 &&
    trimmedMessage.length >= 20 &&
    trimmedMessage.length <= 2000 &&
    EMAIL_REGEX.test(trimmedEmail)
  );
}

function spamScore(payload = {}) {
  const { message = '', name = '', website = '', hp = '', formStartTime } = payload;
  let score = 0;

  if (website || hp) score += 5; // Honeypot triggered

  const now = Date.now();
  const started = Number(formStartTime);
  if (Number.isFinite(started) && started > 0 && now - started < 3000) {
    score += 3; // Too fast to be human
  }

  const messageText = String(message);
  const urlMatches = messageText.match(/https?:\/\//gi) || [];
  if (urlMatches.length >= 2) score += 3;

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(messageText)) score += 2;
  }

  if (/([!?.])\1{6,}/.test(messageText)) score += 3;
  if (/(.)\1{9,}/.test(messageText)) score += 3;

  if (String(name).trim().split(/\s+/).length === 1 && messageText.length < 40) {
    score += 1;
  }

  return score;
}

function isSpam(payload = {}) {
  return spamScore(payload) >= 5;
}

module.exports = {
  isValidContactPayload,
  spamScore,
  isSpam,
};
