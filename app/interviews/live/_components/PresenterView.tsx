import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useMediaQuery } from "@mantine/hooks";
import { nameTructed } from "@/lib/utils";
import { MicOff, ScreenShare } from "lucide-react";
import { Button } from "@/components/ui/button";

// Usage inside a component:

export function PresenterView({ height }: { height: number }) {
  const mMeeting = useMeeting();
  const presenterId: any = mMeeting?.presenterId;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobilePortrait = isMobile;

  const videoPlayer: any = useRef(null);

  const {
    micOn,
    isLocal,
    screenShareStream,
    screenShareAudioStream,
    screenShareOn,
    displayName,
  } = presenterId;

  const mediaStream = useMemo(() => {
    if (screenShareOn) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  const audioPlayer: any = useRef(null);

  useEffect(() => {
    if (
      !isLocal &&
      audioPlayer.current &&
      screenShareOn &&
      screenShareAudioStream
    ) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareAudioStream.track);

      audioPlayer.current.srcObject = mediaStream;
      audioPlayer.current.play().catch((err: any) => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error("audio" + err.message);
        }
      });
    } else {
      audioPlayer.current.srcObject = null;
    }
  }, [screenShareAudioStream, screenShareOn, isLocal]);

  return (
    <div
      style={{
        height: 400,
        // width: "700px",
        width: "100%",
        backgroundColor: "#cccccc",
        position: "relative",
        overflow: "hidden",
        borderRadius: 10,
        margin: 10,
      }}
      className={"video-cover"}
      // className="mt-1 h-full w-full relative flex items-center justify-center bg-gray-750 rounded-lg "
    >
      <audio autoPlay playsInline controls={false} ref={audioPlayer} />
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
        className={"video-contain"}
      >
        <ReactPlayer
          ref={videoPlayer}
          //
          playsinline // very very imp prop
          playIcon={<></>}
          //
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={mediaStream}
          //
          height={"100%"}
          width={"100%"}
          style={{
            filter: isLocal ? "blur(1rem)" : undefined,
          }}
          onError={(err) => {
            console.log(err, "presenter video error");
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            backgroundColor: "orange",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms",
            transitionTimingFunction: "linear",
            padding: 10,
          }}
        >
          {!micOn ? <MicOff fontSize="small" color="primary"></MicOff> : <></>}

          <h1>
            {isLocal
              ? `You are presenting`
              : `${nameTructed(displayName, 15)} is presenting`}
          </h1>
        </div>
        {isLocal ? (
          <div
            className="p-4"
            style={{
              borderRadius: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              backgroundColor: "#ccc",
            }}
          >
            <ScreenShare />
            <div className="p-3">
              <h1>You are presenting to everyone</h1>
            </div>
            <div className="p-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  mMeeting.toggleScreenShare();
                }}
              >
                Stop presenting
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
