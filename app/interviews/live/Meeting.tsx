/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import { JoiningScreen } from "./_components/JoiningScreen";
import { profilesOptionalDefaults } from "@/prisma/generated/zod";
import { MeetingContainer } from "./_components/MeetingContainer";

const Meeting = ({
  meetingID,
  user,
}: {
  user: profilesOptionalDefaults;
  meetingID: string;
}) => {
  const [token, setToken] = useState<any>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJkMzQwMmQ0MC1mZWRmLTQyODAtYjE4YS00ZGFjNDMyZGEwMGMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMTI0MDk0NCwiZXhwIjoxODU5MDI4OTQ0fQ.sMzydbvEet12kUMOFTMzd31TM4HvnfpZonUZPI7Pv7k"
  );
  const [meetingId, setMeetingId] = useState<any>(meetingID);
  const [participantName, setParticipantName] = useState<any>(user.first_name);
  const [micOn, setMicOn] = useState<any>(true);
  const [webcamOn, setWebcamOn] = useState<any>(true);
  const [selectedMic, setSelectedMic] = useState<any>({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState<any>({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState<any>(
    selectedWebcam.id
  );
  const [selectMicDeviceId, setSelectMicDeviceId] = useState<any>(
    selectedMic.id
  );
  const [isMeetingStarted, setMeetingStarted] = useState<any>(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState<any>(false);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<any>(
    []
  );

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef: any = useRef(null);

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return parseInt(raisedHandOn) + 15000 > parseInt(now.toString());
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  return (
    <>
      {isMeetingStarted ? (
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: micOn,
            webcamEnabled: webcamOn,
            name: participantName ? participantName : "TestUser",
            debugMode: false,
          }}
          token={token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingContainer
            onMeetingLeave={() => {
              setToken("");
              setMeetingId("");
              setWebcamOn(false);
              setMicOn(false);
              setMeetingStarted(false);
            }}
            setIsMeetingLeft={setIsMeetingLeft}
            selectedMic={selectedMic}
            selectedWebcam={selectedWebcam}
            selectWebcamDeviceId={selectWebcamDeviceId}
            setSelectWebcamDeviceId={setSelectWebcamDeviceId}
            selectMicDeviceId={selectMicDeviceId}
            setSelectMicDeviceId={setSelectMicDeviceId}
            useRaisedHandParticipants={useRaisedHandParticipants}
            raisedHandsParticipants={raisedHandsParticipants}
            micEnabled={micOn}
            webcamEnabled={webcamOn}
          />
        </MeetingProvider>
      ) : isMeetingLeft ? null : ( //   <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
        <JoiningScreen
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
};

export default Meeting;
