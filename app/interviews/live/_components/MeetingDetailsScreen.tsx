import { Button } from "@/components/ui/button";

export function MeetingDetailsScreen({
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}: any) {
  //

  return (
    <div className={`flex  flex-col w-full`}>
      <h1 className="text-center font-bold text-xl mb-2">Interview Session</h1>
      <p className="text-center text-xs">
        Make sure the date and the time for this interview is accurate.
      </p>
      <br />

      <Button
        onClick={(e) => {
          if (videoTrack) {
            videoTrack.stop();
            setVideoTrack(null);
            onClickStartMeeting();
          } else {
            onClickStartMeeting();
          }
        }}
      >
        Start Interview
      </Button>
    </div>
  );
}
