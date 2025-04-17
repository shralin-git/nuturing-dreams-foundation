import { IoIosRefresh } from "react-icons/io";
import { clearTokens } from "../../../auth/localAuth";

const ErrorComponent = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className=" flex text-center mt-8 items-center justify-center flex-col">
        <IoIosRefresh
          size="30"
          className="cursor-pointer"
          onClick={() => {
            clearTokens();
            window.location.href = window.location.origin;
          }}
        />
        <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
        <p className="text-gray-600">
          We are having some trouble loading the page. Please try again.
        </p>
      </div>
    </div>
  );
};

export default ErrorComponent;
