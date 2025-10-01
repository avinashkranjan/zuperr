"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet";
import { ArrowRightIcon, BellIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useNotifications } from "@src/pages/context/NotificationContext";
import { Card } from "@src/ui/card";
import moment from "moment";
import { patch } from "@api/index";
import { useIsMobile } from "@src/hooks/use-mobile";

export default function Notifications() {
  const { notifications } = useNotifications();
  const [notificationCount, setNotificationCount] = React.useState(
    notifications.length
  );
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notif: any) => !(notif.readBy || []).includes(userId)
    );
    setNotificationCount(unreadNotifications.length);
  }, [notifications]);

  async function markAsRead() {
    try {
      for (const notif of notifications) {
        if (!(notif as any).readBy.includes(userId)) {
          await patch(`/employer/notification/${(notif as any)._id}`, {
            readBy: [...((notif as any).readBy || []), userId],
          });
        }
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="w-8 h-8 text-white border border-white rounded-full flex items-center justify-center relative"
          onClick={() => {
            markAsRead();
          }}
        >
          <BellIcon className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        style={{ maxWidth: useIsMobile() ? "100vw" : "26vw" }}
      >
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {notificationCount} new notification
            {notificationCount !== 1 && "s"}.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 px-0">
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 pb-8">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No new notifications
              </p>
            ) : (
              notifications.map((notif: any, idx) => (
                <Card
                  key={idx}
                  className={`${
                    notif.readBy.includes(userId)
                      ? "bg-muted-foreground/10"
                      : "bg-background"
                  } flex items-start gap-4 p-4 rounded-2xl shadow-sm border border-muted hover:shadow-md transition-all duration-200`}
                >
                  <div className="bg-muted flex items-center justify-center w-12 h-12 rounded-xl">
                    <BellIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <a
                        href={notif.link}
                        className="text-sm text-primary hover:underline hover:text-primary/90 transition-colors"
                      >
                        View Details{" "}
                        <ArrowRightIcon className="inline w-3 h-3" />
                      </a>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {moment(notif.createdAt).format("MMM D, YYYY h:mm A")}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
