import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingDialogueBox({
  webcams,
  mics,
  setSelectedMic,
  setSelectedWebcam,
}: any) {
  const [divHeight, setdivHeight] = useState(0);
  const divRef: any = useRef(null);

  useEffect(() => {
    if (divRef.current && divRef.current.offsetHeight !== divHeight) {
      setdivHeight(divRef.current.offsetHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 col-span-2">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select video" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {webcams?.map((item: any, index: number) => {
              return item?.kind === "videoinput" ? (
                <SelectItem
                  value={item?.deviceId}
                  onClick={() => {
                    setSelectedWebcam((s: any) => ({
                      ...s,
                      id: item?.deviceId,
                    }));
                  }}
                >
                  {item?.label === "" ? `Webcam ${index + 1}` : item?.label}
                </SelectItem>
              ) : null;
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select audio" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {mics?.map((item: any, index: number) => {
              return item?.kind === "audioinput" ? (
                <SelectItem
                  value={item?.deviceId}
                  key={index}
                  onClick={() => {
                    setSelectedMic((s: any) => ({
                      ...s,
                      id: item?.deviceId,
                    }));
                  }}
                >
                  {item?.label ? item?.label : `Mic ${index + 1}`}
                </SelectItem>
              ) : null;
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
