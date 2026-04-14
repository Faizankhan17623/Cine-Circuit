// Bot Command Parser — Cine Circuit Form-Filling Bot
// Parses natural language commands into structured intents

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPassword(text) {
  const match = text.match(/(?:password|pass|pwd)\s+(\S+)/i);
  return match ? match[1] : null;
}

function extractName(text) {
  const match = text.match(/(?:name)\s+([A-Za-z][A-Za-z\s]{1,40}?)(?:\s+(?:email|password|pass|phone|number|otp|code)|$)/i);
  return match ? match[1].trim() : null;
}

function extractPhone(text) {
  const labeled = text.match(/(?:phone|number|mobile|mob|ph)\s+(\d{7,15})/i);
  if (labeled) return labeled[1];
  const tenDigit = text.match(/\b(\d{10})\b/);
  return tenDigit ? tenDigit[1] : null;
}

function extractOtp(text) {
  const labeled = text.match(/(?:otp|code)\s+(\d{4,8})/i);
  if (labeled) return labeled[1];
  const sixDigit = text.match(/\b(\d{6})\b/);
  return sixDigit ? sixDigit[1] : null;
}

function extractCountryCode(text) {
  const match = text.match(/(?:countrycode|country\s*code|cc)\s+(\+?\d{1,4})/i);
  if (match) return match[1].startsWith('+') ? match[1] : '+' + match[1];
  return '+91';
}

function extractUserData(text) {
  return {
    name: extractName(text),
    email: extractEmail(text),
    password: extractPassword(text),
    phone: extractPhone(text),
    otp: extractOtp(text),
    countrycode: extractCountryCode(text),
  };
}

export function parseCommand(text) {
  const t = text.toLowerCase().trim();

  // LOGOUT
  if (/^(logout|log\s*out|sign\s*out|signout)$/.test(t)) {
    return { intent: 'logout', data: {} };
  }

  // SEND OTP — must check before login
  if (/send\s+otp|get\s+otp|otp\s+to|generate\s+otp|resend\s+otp/.test(t)) {
    return { intent: 'send_otp', data: { email: extractEmail(text) } };
  }

  // LOGIN
  if (/^(login|log\s*in|sign\s*in|signin)/.test(t) || /log\s+me\s+in/.test(t)) {
    return { intent: 'login', data: { email: extractEmail(text), password: extractPassword(text) } };
  }

  // CREATE VIEWER
  if (/(create|register|signup|sign\s*up|make|add).*(viewer|user)|(viewer|user).*(create|register|signup)/.test(t)) {
    return { intent: 'create_viewer', data: extractUserData(text) };
  }

  // CREATE ORGANIZER
  if (/(create|register|signup|sign\s*up|make|add).*(organizer|organiser|org)|(organizer|org).*(create|register)/.test(t)) {
    return { intent: 'create_organizer', data: extractUserData(text) };
  }

  // CREATE THEATRE
  if (/(create|register|signup|sign\s*up|make|add).*(theatre|theater|theatrer)|(theatre|theater).*(create|register)/.test(t)) {
    return { intent: 'create_theatre', data: extractUserData(text) };
  }

  // SEARCH MOVIES
  if (/^(search|find|look\s*for|show\s*me)\s+(.+)/.test(t)) {
    const match = text.match(/^(?:search|find|look\s*for|show\s*me)\s+(.+)/i);
    return { intent: 'search', data: { query: match ? match[1].trim() : '' } };
  }

  return { intent: 'unknown', data: {} };
}

// Required fields per intent — used by guided flow
export const FLOW_FIELDS = {
  login: ['email', 'password'],
  send_otp: ['email'],
  create_viewer: ['name', 'email', 'password', 'phone', 'otp'],
  create_organizer: ['name', 'email', 'password', 'phone', 'otp'],
  create_theatre: ['name', 'email', 'password'],
};

// Human-friendly prompts for each missing field
export const FIELD_PROMPTS = {
  email: "What's the email address?",
  password: "What's the password? (minimum 8 characters)",
  name: "What's the full name?",
  phone: "What's the phone number? (10 digits, no spaces)",
  otp: "What's the 6-digit OTP received on email?",
};
