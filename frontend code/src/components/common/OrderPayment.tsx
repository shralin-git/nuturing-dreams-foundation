import { useMutation, useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { API } from "api/API";
import { RegistrationDataContext } from "context/RegistraionContext";
import { useContext } from "react";
import { hoverButtonClass } from "utils/constants";
import { EndPoints } from "utils/enums";
import { sendNotification } from "utils/helperMethods";

const OrderPayment = () => {
  const { newUserDetails, setSelectedRegistrationStep } = useContext(
    RegistrationDataContext
  );

  const { isLoading: orderLoading, data: orderData } = useQuery<any, any>({
    queryKey: ["order"],
    queryFn: async () =>
      await API.get(EndPoints.PAYMENT_ORDER, {
        params: newUserDetails,
      }),
  });

  const { isPending: isVerifyLoading, mutate: verifyPayment } = useMutation({
    mutationFn: (paymentData: any) =>
      API.post(EndPoints.PAYMENT_VERIFY, paymentData),
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res, variables) => {
      setSelectedRegistrationStep("success");
    },
  });

  const initPayment = (data: any) => {
    const options = {
      key: process.env.KEY_SECRET,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      handler: async (response: any) => {
        verifyPayment({ ...response, email: newUserDetails?.email });
      },
      theme: {
        color: "#733c71",
      },
    };
    const rzp1: any = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      initPayment(orderData?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="m-auto h-1/2 w-1/4">
      <div className="m-auto my-2 mt-4 text-center text-xl font-bold">
        Payment
      </div>
      <div className=" flex w-full  h-full bg-white m-auto flex-col items-center gap-2 rounded-md overflow-hidden  ">
        <img
          src={"./images/logo.png"}
          alt="NDF"
          className="book_img h-3/4 bg-cover bg-no-repeat w-full"
        />
        {orderLoading || isVerifyLoading ? (
          <div className="flex justify-center items-center my-auto h-16  rounded ">
            <Spin />
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col h-1/4 gap-4 ">
            <p className="text-lg font-bold">
              Price :{" "}
              <span>
                &#x20B9;{" "}
                {orderData?.data?.data?.amount &&
                  orderData?.data?.data?.amount / 100}
              </span>
            </p>
            <button onClick={handlePayment} className={`  ${hoverButtonClass}`}>
              Pay Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPayment;
