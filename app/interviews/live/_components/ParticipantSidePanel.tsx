import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { nameTructed } from "@/lib/utils";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import {
  HelpingHand,
  MicIcon,
  MicOff,
  VideoIcon,
  VideoOff,
} from "lucide-react";

import React, { useMemo } from "react";

function ParticipantListItem({ participantId, raisedHand, pId }: any) {
  const { micOn, webcamOn, displayName, isLocal } =
    useParticipant(participantId);

  return (
    <div
      key={`participant_${participantId}`}
      className="mt-2 m-2 p-2 bg-gray-700 rounded-lg mb-0"
    >
      <div className="flex flex-1 items-center justify-center relative">
        <Avatar>
          <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-2 mr-1 flex flex-1">
          <p className="text-base text-white overflow-hidden whitespace-pre-wrap text-ellipsis">
            {isLocal ? "You" : nameTructed(displayName, 15)}
          </p>
        </div>
        {raisedHand && (
          <div className="flex items-center justify-center m-1 p-1">
            <HelpingHand />
          </div>
        )}
        <div className="m-1 p-1">{micOn ? <MicIcon /> : <MicOff />}</div>
        <div className="m-1 p-1">{webcamOn ? <VideoIcon /> : <VideoOff />}</div>
      </div>
    </div>
  );
}

export function ParticipantSidePanel({
  panelHeight,
  raisedHandsParticipants,
}: any) {
  const mMeeting = useMeeting();
  const participants: any = mMeeting.participants;

  const sortedRaisedHandsParticipants = useMemo(() => {
    const participantIds = [...participants.keys()];

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          // @ts-ignore
          ({ participantId: rPID }) => rPID === pID
        ) === -1
    );

    const raisedSorted = raisedHandsParticipants.sort((a: any, b: any) => {
      if (a.raisedHandOn > b.raisedHandOn) {
        return -1;
      }
      if (a.raisedHandOn < b.raisedHandOn) {
        return 1;
      }
      return 0;
    });

    const combined = [
      // @ts-ignore
      ...raisedSorted.map(({ participantId: p }) => ({
        raisedHand: true,
        participantId: p,
      })),
      ...notRaised.map((p) => ({ raisedHand: false, participantId: p })),
    ];

    return combined;
  }, [raisedHandsParticipants, participants]);

  const filterParticipants = (sortedRaisedHandsParticipants: any) =>
    sortedRaisedHandsParticipants;

  const part = useMemo(
    // @ts-ignore
    () => filterParticipants(sortedRaisedHandsParticipants, participants),

    [sortedRaisedHandsParticipants, participants]
  );

  return (
    <div
      className={`flex w-full flex-col bg-gray-750 overflow-y-auto `}
      style={{ height: panelHeight }}
    >
      <div
        className="flex flex-col flex-1"
        style={{ height: panelHeight - 100 }}
      >
        {[...participants.keys()].map((participantId, index) => {
          const { raisedHand, participantId: peerId } = part[index];
          return (
            <div key={`participant_${peerId}`}>
              <ParticipantListItem
                participantId={peerId}
                raisedHand={raisedHand}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
