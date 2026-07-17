import { useLayoutEffect } from "react";
import { supabase } from "@utils/supabase";
import Auth from "@utils/auth";
import { User } from "typings";
import { useLocation } from "react-router";
import { userApiClient } from "@utils/api/userApiClient";

export function useCheckSession(setState: Function, sessionUser: User | undefined | null) {
  const { pathname } = useLocation();
  const auth = new Auth();
  async function getSetSession() {
    const sessionInfo = await supabase.auth.getSession();
    if (sessionInfo && sessionInfo.data.session) {
      // The jwt cookie is the authoritative source for the bearer token attached
      // by the axios request interceptor; keep it in sync with the live session.
      auth.setToken(sessionInfo.data.session.access_token);
      await userApiClient.sessionSignin(sessionInfo.data.session.user.email!);
      const checkData = await userApiClient.sessionCheck(sessionInfo.data.session.user.email!);

      if(checkData)
        setState(checkData.result);
    } else {
      auth.clearToken();
      setState(undefined);
    }
  }

  useLayoutEffect(() => {
    getSetSession();
  }, [sessionUser?.id, pathname]);

  return {};
}