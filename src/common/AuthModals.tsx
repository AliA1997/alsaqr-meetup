import { ModalBody, ModalPortal } from "@common/Modal";
import { useStore } from "@stores/index";
import { observer } from "mobx-react-lite";
import { supabase } from "@utils/supabase";
import { ROUTES_USER_CANT_ACCESS } from "@utils/constants";
import { useLocation } from "react-router";


export const LoginModal = observer(() => {
  const { pathname } = useLocation();
  const { authStore, modalStore } = useStore();
  const { currentSessionUser } = authStore;
  const { closeModal } = modalStore;

  const handleDiscordSignIn = () => supabase.auth.signInWithOAuth({
    provider: "discord",
  });
  const handleGoogleSignIn = () => supabase.auth.signInWithOAuth({
    provider: "google",
  });
  const handleFacebookSignIn = () => supabase.auth.signInWithOAuth({
    provider: "facebook",
  });
  
  return (
    <ModalPortal>
      <ModalBody onClose={() => {
        const canCloseLoginModal = !(ROUTES_USER_CANT_ACCESS.some(r => pathname.includes(r)));

        if (canCloseLoginModal || currentSessionUser)
          closeModal();

      }}>
        <div className='flex flex-col justify-center'>
          <button
            className={`
              flex items-center p-3 border rounded-lg font-medium 
              text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800
              dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white
           `}
            onClick={handleGoogleSignIn}
          >
            <img
              src="/google-icon.svg"
              height={30}
              width={30}
              alt="Google Social Button Icon"
              className="mr-2"
            />
            Sign in with Google
          </button>

          <button
            className={`
              flex items-center p-3 border rounded-lg font-medium 
              text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800
              dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white
            `}
            onClick={handleFacebookSignIn}
          >
            <img
              src="/facebook-icon.svg"
              height={30}
              width={30}
              alt="Facebook Social Button Icon"
              className="mr-2"
            />
            Sign in with Facebook
          </button>
          
          <button
            className={`
                  flex items-center p-3 border rounded-lg font-medium 
                  text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800
                  dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white
                `}
            onClick={handleDiscordSignIn}
          >
            <img
              src="/discord-icon.svg"
              height={30}
              width={30}
              alt="Discord Social Button Icon"
              className="mr-2"
            />
            Sign in with Discord
          </button>
        </div>

      </ModalBody>
    </ModalPortal>
  );
});
