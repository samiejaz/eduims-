import axios from "axios";
import { format, parseISO } from "date-fns";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllSessions(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetSessionWhere?LoginUserID=" + LoginUserID
  );

  let newData = data.data.map((item) => {
    return {
      SessionID: item.SessionID,
      SessionTitle: item.SessionTitle,
      SessionOpeningDate: format(
        parseISO(item.SessionOpeningDate),
        "dd-MMM-yyyy"
      ),
      SessionClosingDate: format(
        parseISO(item.SessionClosingDate),
        "dd-MMM-yyyy"
      ),
    };
  });

  return newData;
}

export async function fetchSessionById(SessionID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetSessionWhere?SessionID=${SessionID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

export async function deleteSessionByID(session) {
  await axios.post(
    apiUrl +
      `/EduIMS/SessionDelete?SessionID=${session.SessionID}&LoginUserID=${session.LoginUserID}`
  );
}
