const sessionIDToMap = new Map<string, string>();

export const createSession = (sessionID: string, userID: string) => {
  sessionIDToMap.set(sessionID, userID);
  return sessionID;
};

export const getUserIDFromSession = (sessionID: string) => {
  return sessionIDToMap.get(sessionID);
};

export const isValidSession = (sessionID: string) => {
  return sessionIDToMap.has(sessionID);
}

export const deleteSession = (sessionID: string) => {
  sessionIDToMap.delete(sessionID);
};  
