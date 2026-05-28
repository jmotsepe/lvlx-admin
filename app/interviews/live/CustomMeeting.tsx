"use client";
import React, { useEffect } from "react";
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { getURL } from "@/lib/utils";

const CustomMeeting = ({ id, name }: { id: string; name: string }) => {
  //

  useEffect(() => {
    //
    const meeting = new VideoSDKMeeting();

    meeting.init({
      name: name,
      apiKey: "d3402d40-fedf-4280-b18a-4dac432da00c",
      meetingId: id,

      // containerId: "videosdk-meeting",
      redirectOnLeave: `${getURL()}/interviews/live`,
      participantId: "",
      micEnabled: true,
      webcamEnabled: true,
      // @ts-ignore
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJkMzQwMmQ0MC1mZWRmLTQyODAtYjE4YS00ZGFjNDMyZGEwMGMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMTI0MDk0NCwiZXhwIjoxODU5MDI4OTQ0fQ.sMzydbvEet12kUMOFTMzd31TM4HvnfpZonUZPI7Pv7k",
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      participantCanLeave: true,

      chatEnabled: true,
      screenShareEnabled: "true",
      pollEnabled: true,
      whiteboardEnabled: true,
      raiseHandEnabled: true,
      mode: "CONFERENCE",

      recording: {
        enabled: true,
        autostart: true,
        theme: "dark",
        webhookUrl: "https://www.videosdk.live/callback",
        awsDirPath: `/meeting-recordings/${id}/`, // automatically save recording in this s3 path
      },

      layout: {
        type: "GRID", // "SPOTLIGHT" | "SIDEBAR" | "GRID"
        priority: "SPEAKER", // "SPEAKER" | "PIN",
        gridSize: 3,
      },

      branding: {
        enabled: true,
        logoURL:
          "https://static.zujonow.com/videosdk.live/videosdk_logo_circle_big.png",
        name: "LVLX Interview",
        poweredBy: false,
      },

      permissions: {
        pin: true,
        askToJoin: false, // Ask joined participants for entry in meeting
        toggleParticipantMic: true, // Can toggle other participant's mic
        toggleParticipantWebcam: true, // Can toggle other participant's webcam
        toggleParticipantScreenshare: true, // Can toggle other partcipant's screen share
        toggleParticipantMode: true, // Can toggle other participant's mode
        canCreatePoll: true, // Can create a poll
        drawOnWhiteboard: true, // Can draw on whiteboard
        toggleWhiteboard: true, // Can toggle whiteboard
        toggleVirtualBackground: true, // Can toggle virtual background
        toggleRecording: true, // Can toggle meeting recording
        toggleLivestream: true, //can toggle live stream
        removeParticipant: true, // Can remove participant
        endMeeting: true, // Can end meeting
        changeLayout: true, //can change layout
        toggleHLS: false,
        canToggleParticipantTab: true,
        toggleRealtimeTranscription: false,
      },

      joinScreen: {
        visible: true, // Show the join screen ?
        title: "LVLX Interview", // Meeting title
        meetingUrl: window.location.href, // Meeting joining url
      },

      leftScreen: {
        // visible when redirect on leave not provieded
        rejoinButtonEnabled: true,
        actionButton: {
          label: "Video SDK Live", // action button label
          href: "https://videosdk.live/", // action button href
        },
      },

      notificationSoundEnabled: true,

      debug: true,
      maxResolution: "hd", // "hd" or "sd",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="videosdk-meeting" className="min-h-screen h-full" />;
};

export default CustomMeeting;
