import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2Icon, WalletCardsIcon } from "lucide-react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

function Profile({ openDialog }: any) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [maxToken, setMaxToken] = useState<number>(0);
  const updateUserOrder=useMutation(api.users.UpdateTokens)
  useEffect(() => {
    setMaxToken(user?.orderId ? 500000 : 10000);
  }, [user]);

  const GenerateSubscriptionId = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/create-subscription");
      MakePayment(result?.data?.id);
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
    setLoading(false);
  };

  const MakePayment = (subscriptionId: string) => {
    let options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: "AI Assistants_App",
      order_id: subscriptionId,
      handler: async function (response: any) {
        console.log("Payment Successful:", response);
        if(response?.razorpay_payment_id){
         await  updateUserOrder({
            uid:user?._id,
            orderId:response.razorpay_payment_id,
            credits:user.credits+500000
          })
          toast("Thank You!!! Credits Added")
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      notes: {},
      theme: {
        color: "#000",
      },
    };
    //@ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Dialog open={openDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className="flex gap-4 items-center">
                <Image
                  src={user?.picture || "/default-avatar.png"}
                  alt="user"
                  width={150}
                  height={150}
                  className="w-[60px] h-[60px] rounded-full"
                />
              </div>
              <div>
                <h2 className="font-bold text-lg">{user?.name}</h2>
                <h2 className="text-gray-500">{user?.email}</h2>
              </div>
              <hr className="my-3" />
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-lg">Token Usage</h2>
                <h2>
                  {user?.credits}/{maxToken}
                </h2>
                <Progress value={(user?.credits / maxToken) * 100} max={maxToken} />
                <h2 className="flex justify-between font-bold mt-3 text-lg">
                  Current Plan
                  <span className="p-1 bg-gray-200 rounded-md px-2 font-normal">
                    {user?.orderId ? "Pro Plan" : "Free Plan"}
                  </span>
                </h2>
              </div>
              <div>
                <div className="p-4 border rounded-xl">
                  <div className="flex justify-between">
                    <h2 className="font-bold text-lg">Pro Plan</h2>
                    <h2>500,000 Tokens</h2>
                  </div>
                  <h2 className="font-bold text-lg">$10/Month</h2>
                </div>
                <hr className="my-3" />
                <Button
                  disabled={loading}
                  onClick={GenerateSubscriptionId}
                  className="w-full flex items-center gap-2"
                >
                  {loading ? <Loader2Icon className="animate-spin" /> : <WalletCardsIcon />}
                  Upgrade $10
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
