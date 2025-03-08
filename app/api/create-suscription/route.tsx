import { NextRequest, NextResponse } from "next/server";
import RazorPay from "razorpay"
export async function POST(req:NextRequest){
    // const data=await req.json();
    var instance=new RazorPay({key_id:process.env.RAZORPLAY_LIVE_KEY,key_secret:process.env.RAZORPAY_SECRET_KEY})
    const result=await instance.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID!,
        customer_notify: 1,
        quantity: 1,
        total_count: 12,
        
        addons: [
        
        ],
        notes: {
          
        }
      })
      return NextResponse.json(result)
}