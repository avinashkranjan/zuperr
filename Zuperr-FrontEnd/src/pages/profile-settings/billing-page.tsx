/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";

const plans = {
  monthly: [
    {
      title: "Basic",
      price: "₹ 499",
      frequency: "/user/mo",
      features: [
        "1 job posting",
        "Own analytics platform",
        "Chat support",
        "1 Free add",
        "Unlimited users",
        "0% fees with 3rd party gateways",
      ],
    },
    {
      title: "Startup",
      price: "₹ 999",
      frequency: "/user/mo",
      features: [
        "10 job posting",
        "Own analytics platform",
        "Chat support",
        "3 Free add",
        "Unlimited users",
        "0% fees with 3rd party gateways",
      ],
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "₹ 1999",
      frequency: "/user/mo",
      features: [
        "Unlimited job posting",
        "Own analytics platform",
        "Chat support",
        "Free add",
        "Unlimited users",
        "0% fees with 3rd party gateways",
      ],
    },
  ],
  yearly: [
    {
      title: "Basic",
      price: "₹ 425",
      frequency: "/user/mo",
      discount: "15% OFF",
      features: [
        "1 job posting",
        "Own analytics platform",
        "Chat support",
        "1 Free add",
        "Unlimited users",
        "0% fees with 3rd party gateways",
      ],
    },
    {
      title: "Startup",
      price: "₹ 849",
      frequency: "/user/mo",
      discount: "15% OFF",
      features: [
        "10 job posting",
        "Own analytics platform",
        "Chat support",
        "3 Free add",
        "Unlimited users",
        "0% fees with 3rd party gateways",
      ],
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "₹ 1699",
      frequency: "/user/mo",
      discount: "15% OFF",
      features: [
        "Unlimited job posting",
        "Own analytics platform",
        "Chat support",
        "Free add",
        "Unlimited users",
        "0% fees with 3rd party gateways",
      ],
    },
  ],
};

const PlanCard = ({ plan }: any) => (
  <div
    className={`rounded-xl shadow-md p-6 w-full max-w-[16rem] space-y-4 border boder-gray-50 ${
      plan.highlight ? "bg-blue-600 text-white" : "bg-white"
    }`}
  >
    <h3 className="text-xl font-semibold">{plan.title}</h3>
    <p className="text-3xl font-bold flex flex-row items-start leading-tight">
      {plan.price}
      <span className="text-sm font-normal translate-y-1 scale-75 origin-bottom-left">
        {plan.frequency}
      </span>
    </p>
    {plan.discount && (
      <p className="text-sm w-[4.5rem] px-2 py-1 font-semibold rounded-lg text-green-700 bg-gray-100">
        {plan.discount}
      </p>
    )}
    <Button
      className={`w-full h-12 text-lg ${
        plan.highlight
          ? "bg-white text-blue-600 hover:text-black"
          : "hover:text-white"
      }`}
    >
      Choose plan
    </Button>
    <ul className="text-sm space-y-4">
      {plan.features.map((feature: string, idx: number) => (
        <li key={idx} className="flex items-center gap-2 text-md">
          <Check size={16} className="text-green-500" /> {feature}
        </li>
      ))}
    </ul>
  </div>
);

export default function BillingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "yearly">("monthly");
  const [tab, setTab] = useState("plan");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Billing & Subscription</h2>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="flex justify-start border-b border-gray-200 bg-transparent p-0 gap-0">
              <TabsTrigger
                value="plan"
                className="text-sm sm:text-base font-medium px-4 py-2 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 transition-colors"
              >
                Plan Details
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-sm sm:text-base font-medium px-4 py-2 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 transition-colors"
              >
                Payment History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plan">
              <div className="text-center mt-6">
                <h3 className="text-xl font-semibold">
                  Perfect plans for every budget
                </h3>
                <p className="text-sm text-muted-foreground">
                  Experience Salestic free of charge. Upgrade your plan anytime,
                  no card needed!
                </p>
                <div className="flex justify-center mt-8">
                  <div
                    className={`${
                      activePlan === "monthly"
                        ? "bg-blue-400 text-white"
                        : "hover:border hover:border-blue-400"
                    } pl-8 pr-3 py-2 rounded-s-full cursor-pointer`}
                    onClick={() => setActivePlan("monthly")}
                  >
                    Monthly
                  </div>
                  <div
                    className={`${
                      activePlan === "yearly"
                        ? "bg-blue-400 text-white"
                        : "hover:border hover:border-blue-400"
                    } pr-8 pl-3 py-2 rounded-e-full cursor-pointer`}
                    onClick={() => setActivePlan("yearly")}
                  >
                    Yearly{" "}
                    <span className="ml-1 text-green-700 bg-gray-100 py-1 px-2 rounded-xl font-bold text-sm">
                      15% OFF
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                {plans[activePlan].map((plan, index) => (
                  <PlanCard key={index} plan={plan} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card className="mt-6">
                <CardContent className="overflow-x-auto p-0">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-muted text-left text-xs font-semibold text-gray-700">
                        <th className="p-4">Date/Time</th>
                        <th className="p-4">Subscription Plan</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Invoice Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(8)].map((_, i) => (
                        <tr
                          key={i}
                          className="border-t text-gray-600 hover:bg-gray-50"
                        >
                          <td className="p-4 flex items-center gap-2">
                            <div
                              className={`h-7 w-7 rounded-sm ${
                                i === 3 || i === 4
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            July 3, 7:35 PM
                          </td>
                          <td className="p-4">Monthly</td>
                          <td className="p-4 font-medium">₹ 499</td>
                          <td className="p-4">Card Payment</td>
                          <td className="p-4 text-blue-600 underline cursor-pointer">
                            Link
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-center items-center gap-4 p-4">
                    <Button variant="ghost">Previous</Button>
                    <Button
                      variant="outline"
                      className="bg-orange-100 text-black"
                    >
                      1
                    </Button>
                    <Button variant="ghost">2</Button>
                    <Button variant="ghost">3</Button>
                    <Button variant="ghost">Next</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
