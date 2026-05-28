import { Button } from "@/components/ui/button";
import { Mic, MicOff, VideoIcon, VideoOff } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SettingDialogueBox from "./SettingDialogueBox";
import { MeetingDetailsScreen } from "./MeetingDetailsScreen";
import { Card } from "@/components/ui/card";

export function JoiningScreen({
  setSelectedMic,
  setSelectedWebcam,
  onClickStartMeeting,
  micEnabled,
  webcamEnabled,
  setWebcamOn,
  setMicOn,
}: any) {
  const [setting, setSetting] = useState("video");
  const [{ webcams, mics }, setDevices] = useState<any>({
    devices: [],
    webcams: [],
    mics: [],
  });

  const [videoTrack, setVideoTrack] = useState(null);

  const [dlgMuted, setDlgMuted] = useState(false);

  const videoPlayerRef: any = useRef(null);
  const popupVideoPlayerRef: any = useRef(null);
  const popupAudioPlayerRef: any = useRef(null);

  const videoTrackRef: any = useRef(null);
  const audioTrackRef: any = useRef(null);
  const audioAnalyserIntervalRef: any = useRef(null);

  const [audioTrack, setAudioTrack] = useState(null);

  // Now, you can use these values in your component logic to make responsive design decisions

  const webcamOn = useMemo(() => !!videoTrack, [videoTrack]);
  const micOn = useMemo(() => !!audioTrack, [audioTrack]);

  const _handleTurnOffWebcam = () => {
    const videoTrack: any = videoTrackRef.current;

    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(null);
      setWebcamOn(false);
    }
  };
  const _handleTurnOnWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (!videoTrack) {
      getDefaultMediaTracks({ mic: false, webcam: true, firstTime: false });
      setWebcamOn(true);
    }
  };

  const _toggleWebcam = () => {
    const videoTrack: any = videoTrackRef.current;

    if (videoTrack) {
      _handleTurnOffWebcam();
    } else {
      _handleTurnOnWebcam();
    }
  };
  const _handleTurnOffMic = () => {
    const audioTrack: any = audioTrackRef.current;

    if (audioTrack) {
      audioTrack.stop();

      setAudioTrack(null);
      setMicOn(false);
    }
  };
  const _handleTurnOnMic = () => {
    const audioTrack: any = audioTrackRef.current;

    if (!audioTrack) {
      getDefaultMediaTracks({ mic: true, webcam: false, firstTime: true });
      setMicOn(true);
    }
  };
  const _handleToggleMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      _handleTurnOffMic();
    } else {
      _handleTurnOnMic();
    }
  };

  const changeWebcam = async (deviceId: any) => {
    const currentvideoTrack: any = videoTrackRef.current;

    if (currentvideoTrack) {
      currentvideoTrack.stop();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });
    const videoTracks = stream.getVideoTracks();

    const videoTrack: any = videoTracks.length ? videoTracks[0] : null;

    setVideoTrack(videoTrack);
  };
  const changeMic = async (deviceId: any) => {
    const currentAudioTrack: any = audioTrackRef.current;
    currentAudioTrack && currentAudioTrack.stop();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
    });
    const audioTracks = stream.getAudioTracks();

    const audioTrack: any = audioTracks.length ? audioTracks[0] : null;
    clearInterval(audioAnalyserIntervalRef.current);

    setAudioTrack(audioTrack);
  };

  const getDefaultMediaTracks = async ({ mic, webcam, firstTime }: any) => {
    if (mic) {
      const audioConstraints = {
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        audioConstraints
      );
      const audioTracks = stream.getAudioTracks();

      const audioTrack: any = audioTracks.length ? audioTracks[0] : null;

      setAudioTrack(audioTrack);
      if (firstTime) {
        setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId,
        });
      }
    }

    if (webcam) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        videoConstraints
      );
      const videoTracks = stream.getVideoTracks();

      const videoTrack: any = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
      if (firstTime) {
        setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId,
        });
      }
    }
  };

  async function startMuteListener() {
    const currentAudioTrack: any = audioTrackRef.current;

    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }

      currentAudioTrack.addEventListener("mute", () => {
        setDlgMuted(true);
      });
    }
  }

  const getDevices = async ({
    micEnabled,
    webcamEnabled,
  }: {
    micEnabled: boolean;
    webcamEnabled: boolean;
  }) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const webcams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");

      const hasMic = mics.length > 0;
      const hasWebcam = webcams.length > 0;

      setDevices({ webcams, mics, devices });

      if (hasMic) {
        startMuteListener();
      }

      getDefaultMediaTracks({
        mic: hasMic && micEnabled,
        webcam: hasWebcam && webcamEnabled,
        firstTime: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    audioTrackRef.current = audioTrack;

    startMuteListener();
  }, [audioTrack]);

  useEffect(() => {
    videoTrackRef.current = videoTrack;

    if (videoTrack) {
      const videoSrcObject = new MediaStream([videoTrack]);

      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = videoSrcObject;
        videoPlayerRef.current.play();
      }

      setTimeout(() => {
        if (popupVideoPlayerRef.current) {
          popupVideoPlayerRef.current.srcObject = videoSrcObject;
          popupVideoPlayerRef.current.play();
        }
      }, 1000);
    } else {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = null;
      }
      if (popupVideoPlayerRef.current) {
        popupVideoPlayerRef.current.srcObject = null;
      }
    }
  }, [videoTrack, setting]);

  useEffect(() => {
    getDevices({ micEnabled, webcamEnabled });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-lg py-10 px-4">
      <Card className="grid grid-cols-1 p-4 rounded-xl">
        <h1 className="font-bold text-2xl">Setup your devices</h1>
        <p className="text-sm">
          Make sure you have a working audio device selected
        </p>
        <div className="grid grid-cols-2 gap-5 my-5">
          <Button
            onClick={() => {
              _handleToggleMic();
            }}
            variant={micOn ? "default" : "destructive"}
          >
            {micOn ? <Mic /> : <MicOff />}
          </Button>
          <Button
            onClick={() => _toggleWebcam()}
            variant={webcamOn ? "default" : "destructive"}
          >
            {webcamOn ? <VideoIcon /> : <VideoOff />}
          </Button>
          <SettingDialogueBox
            popupVideoPlayerRef={popupVideoPlayerRef}
            popupAudioPlayerRef={popupAudioPlayerRef}
            changeWebcam={changeWebcam}
            changeMic={changeMic}
            setting={setting}
            setSetting={setSetting}
            webcams={webcams}
            mics={mics}
            setSelectedMic={setSelectedMic}
            setSelectedWebcam={setSelectedWebcam}
            videoTrack={videoTrack}
            audioTrack={audioTrack}
          />
        </div>
        <div>
          {!webcamOn ? (
            <div className=" border rounded-xl aspect-video max-h-60 h-60 flex items-center justify-center w-full">
              <h1 className="font-bold text-center text-red-700">
                Video is off
              </h1>
            </div>
          ) : (
            <div className=" mx-auto w-full flex justify-center items-center">
              <video
                autoPlay
                playsInline
                muted
                ref={videoPlayerRef}
                controls={false}
                className={"aspect-video max-h-60"}
              />
            </div>
          )}
        </div>
        <div className="w-full  p-10 flex flex-1 items-center justify-center ">
          <MeetingDetailsScreen
            videoTrack={videoTrack}
            setVideoTrack={setVideoTrack}
            onClickStartMeeting={onClickStartMeeting}
            onClickJoin={async (id: any) => {
              if (videoTrack) {
                // @ts-ignore
                videoTrack.stop();
                setVideoTrack(null);
              }
              onClickStartMeeting();
            }}
            onClickCreateMeeting={async () => {
              const token = "w00wnncunwoe";
              const _meetingId = "nxwindowmcomw";
              return _meetingId;
            }}
          />
        </div>
      </Card>
    </div>
  );
}
