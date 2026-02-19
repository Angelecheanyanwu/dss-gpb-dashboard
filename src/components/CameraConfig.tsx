"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronRight, Info } from "lucide-react";
import ActionButton2 from "./ActionButton2";
import Loader from "./Loader";
import { cn } from "@/lib/utils";

// Types
interface CameraModel {
  camera_name: string;
  camera_password: string;
  ip_address: string;
}

const CameraConfig = () => {
  const recommendedCameraCount = 1;
  const [cameras, setCameras] = useState<CameraModel[]>(
    Array.from({ length: recommendedCameraCount }, () => ({
      camera_name: "",
      camera_password: "",
      ip_address: "",
    }))
  );
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const handleRowChange = (
    index: number,
    field: keyof CameraModel,
    value: string
  ) => {
    const updatedCameras = cameras.map((camera, i) =>
      i === index ? { ...camera, [field]: value } : camera
    );
    setCameras(updatedCameras);
  };

  const handleAddCamera = () => {
    setCameras([
      ...cameras,
      { camera_name: "", camera_password: "", ip_address: "" },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedCameras = cameras.filter((_, i) => i !== index);
    setCameras(updatedCameras);
  };

  const submitCameras = () => {
    setErrorText("");
    // Check if all fields are filled
    for (let camera of cameras) {
      if (
        !camera.camera_name ||
        !camera.camera_password ||
        !camera.ip_address
      ) {
        setErrorText("Please fill out all fields for each camera.");
        return;
      }
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="w-full flex flex-col rounded-2xl bg-card border border-border shadow-2xl relative overflow-hidden">
      <div className="flex flex-col gap-6 w-full h-full p-6 lg:p-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-2xl font-black uppercase tracking-tight">
            Security Node Configuration
          </h2>
          <div className="flex items-start gap-4">
            <p className="text-muted-foreground text-xs font-bold leading-relaxed max-w-xl">
              Initialize your surveillance infrastructure by registering security nodes. 
              Required parameters: Identifier, Secure Credentials, and IPv4 Address.
            </p>

            <div
              className="mt-1 cursor-pointer relative"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
            >
              <Info className="text-blue-grey h-4 w-4" />

              {/* info box */}
              {showInfo && (
                <div className="absolute top-6 -left-10 w-72 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-4 text-[10px] text-slate-300 z-50 flex flex-col gap-2 leading-relaxed">
                  <div className="font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2 mb-1">Infrastructure Setup</div>
                  Authentication protocol requires verified node identity and encrypted tunnel parameters. Your connection remains isolated within the secure perimeter.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active nodes: {cameras.length}</span>
            <div className="w-32">
                <ActionButton2
                text="Add Node"
                textSmall
                bgColor="blue-grey"
                borderColor="blue-grey"
                onClick={handleAddCamera}
                />
            </div>
        </div>

        {/* Camera List/Table */}
        <div className="w-full overflow-hidden rounded-xl border border-border bg-muted/30">
          <div className="p-4 flex flex-col gap-4">
            {cameras.map((camera, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-3 p-4 bg-card rounded-lg border border-border/50 group hover:border-primary/30 transition-all">
                    <div className="flex-1 min-w-[150px] space-y-1.5">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider ml-1">Node Identifier</label>
                        <input 
                            type="text" 
                            placeholder="e.g. PERIMETER_NW" 
                            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs font-bold outline-none focus:border-primary transition-all"
                            value={camera.camera_name}
                            onChange={(e) => handleRowChange(index, 'camera_name', e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[150px] space-y-1.5">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider ml-1">IP Address</label>
                        <input 
                            type="text" 
                            placeholder="192.168.x.x" 
                            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs font-bold outline-none focus:border-primary transition-all font-mono"
                            value={camera.ip_address}
                            onChange={(e) => handleRowChange(index, 'ip_address', e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[150px] space-y-1.5">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider ml-1">Access Protocol</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs font-bold outline-none focus:border-primary transition-all"
                            value={camera.camera_password}
                            onChange={(e) => handleRowChange(index, 'camera_password', e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => handleDeleteRow(index)}
                        className="p-2.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all mb-0.5"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ))}

            {cameras.length === 0 && (
                <div className="py-10 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-40">
                    No nodes configured. Click "Add Node" to begin.
                </div>
            )}
          </div>
        </div>

        {errorText && (
          <p className="w-full text-[10px] text-center text-red-600 font-black uppercase tracking-widest">
            ERROR: {errorText}
          </p>
        )}

        <div className="w-48 self-end mt-4">
          <ActionButton2 text="Initialize System" onClick={submitCameras} />
        </div>
      </div>
      
      {/* loader */}
      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <Loader />
          <span className="text-[10px] font-black text-foreground uppercase tracking-[0.3em] animate-pulse">Initializing Nodes...</span>
        </div>
      )}
    </div>
  );
};

export default CameraConfig;
