import { Button } from "@/components/ui/button";
import { useMeeting } from "@videosdk.live/react-sdk";
import { X } from "lucide-react";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import { ParticipantSidePanel } from "./ParticipantSidePanel";
import { ChatSidePanel } from "./ChatSidePanel";

const SideBarTabView = ({
  height,
  sideBarContainerWidth,
  panelHeight,
  sideBarMode,
  raisedHandsParticipants,
  panelHeaderHeight,
  panelHeaderPadding,
  panelPadding,
  handleClose,
}: any) => {
  const { participants } = useMeeting();

  function capitalizeText(text: string) {
    // Use the replace() function with a regular expression to find the start of each word
    // and apply the toUpperCase() method to the first character.
    return text.replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  return (
    <div
      style={{
        // height,
        width: sideBarContainerWidth,
        paddingTop: panelPadding,
        paddingLeft: panelPadding,
        paddingRight: panelPadding,
        paddingBottom: panelPadding,
      }}
    >
      <div
        style={{
          height: height,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <>
          {sideBarMode && (
            <div
              style={{
                padding: panelHeaderPadding,
                height: panelHeaderHeight - 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #70707033",
              }}
            >
              <h1 style={{ fontWeight: "bold" }}>
                {sideBarMode === "PARTICIPANTS"
                  ? `${capitalizeText(
                      String(sideBarMode || "").toLowerCase()
                    )} (${new Map(participants)?.size})`
                  : capitalizeText(String(sideBarMode || "").toLowerCase())}
              </h1>
              <Button
                size={"icon"}
                onClick={handleClose}
                style={{ margin: 0, padding: 0 }}
              >
                <X />
              </Button>
            </div>
          )}
          {sideBarMode === "PARTICIPANTS" ? (
            <ParticipantSidePanel
              panelHeight={panelHeight}
              raisedHandsParticipants={raisedHandsParticipants}
            />
          ) : sideBarMode === "CHAT" ? (
            <ChatSidePanel panelHeight={panelHeight} />
          ) : null}
        </>
      </div>
    </div>
  );
};

export function SidebarContainer({
  height,
  sideBarMode,
  setSideBarMode,
  raisedHandsParticipants,
}: any) {
  const panelPadding = 8;

  const paddedHeight = height - panelPadding * 3.5;
  const xl = useMediaQuery("(min-width: 1200px)");
  const lg = useMediaQuery("(min-width: 992px)");
  const md = useMediaQuery("(min-width: 768px)");
  const sm = useMediaQuery("(min-width: 576px)");

  // Responsive styles
  const sideBarContainerWidth = xl ? 400 : lg ? 360 : md ? 320 : sm ? 280 : 240;
  const panelHeaderHeight = xl ? 52 : lg ? 48 : md ? 44 : sm ? 40 : 36;
  const panelHeaderPadding = xl ? 12 : lg ? 10 : md ? 8 : sm ? 6 : 4;

  const mobileBreakpoint = 768;

  // Use useMediaQuery hook to monitor changes in the viewport's width
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

  const handleClose = () => {
    setSideBarMode(null);
  };

  const isTab = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  return sideBarMode ? (
    isTab || isMobile ? (
      // <Dialog
      //   closeAfterTransition
      //   fullScreen
      //   open={sideBarMode}
      //   onClose={handleClose}
      //   TransitionComponent={Transition}
      // >
      <SideBarTabView
        height={"100%"}
        sideBarContainerWidth={"100%"}
        panelHeight={height}
        sideBarMode={sideBarMode}
        raisedHandsParticipants={raisedHandsParticipants}
        panelHeaderHeight={panelHeaderHeight}
        panelHeaderPadding={panelHeaderPadding}
        panelPadding={panelPadding}
        handleClose={handleClose}
      />
    ) : (
      // </Dialog>
      <SideBarTabView
        height={paddedHeight}
        sideBarContainerWidth={sideBarContainerWidth}
        panelHeight={paddedHeight - panelHeaderHeight - panelHeaderPadding}
        sideBarMode={sideBarMode}
        raisedHandsParticipants={raisedHandsParticipants}
        panelHeaderHeight={panelHeaderHeight}
        panelHeaderPadding={panelHeaderPadding}
        panelPadding={panelPadding}
        handleClose={handleClose}
      />
    )
  ) : (
    <></>
  );
}
