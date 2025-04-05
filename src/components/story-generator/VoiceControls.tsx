
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, Volume2, Pause, Play } from "lucide-react";
import { StoryResponse } from "@/lib/gemini";
import { toast } from "@/hooks/use-toast";

interface VoiceControlsProps {
  story: StoryResponse;
  showArcsView: boolean;
}

const voices = [
  { id: "default", name: "Default" },
  { id: "female", name: "Female" },
  { id: "male", name: "Male" }
];

export const VoiceControls: React.FC<VoiceControlsProps> = ({ story, showArcsView }) => {
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("default");
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const speechUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
    
    return () => {
      if (speechSynthesis.current && speechUtterance.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  const handleGenerateVoice = async () => {
    if (!story) {
      toast({
        title: "No Story Found",
        description: "Please generate or select a story first before creating a narration",
        variant: "destructive",
      });
      return;
    }
    
    setVoiceLoading(true);
    try {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
        setIsPlaying(false);
      }
      
      const textToNarrate = showArcsView && story.storyArcs && story.storyArcs.length > 0
        ? story.storyArcs.map(arc => `${arc.title}. ${arc.content}`).join(' ')
        : story.story;
        
      setVoiceProgress(50);
      
      speechUtterance.current = new SpeechSynthesisUtterance(textToNarrate);
      
      if (speechSynthesis.current) {
        const voices = speechSynthesis.current.getVoices();
        
        if (voices.length > 0) {
          let selectedSynthVoice;
          
          switch (selectedVoice) {
            case 'female':
              selectedSynthVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('woman'));
              break;
            case 'male':
              selectedSynthVoice = voices.find(voice => voice.name.includes('male') || voice.name.includes('man'));
              break;
            default:
              selectedSynthVoice = voices[0];
          }
          
          if (selectedSynthVoice) {
            speechUtterance.current.voice = selectedSynthVoice;
          }
        }
      }
      
      speechUtterance.current.onstart = () => {
        setIsPlaying(true);
      };
      
      speechUtterance.current.onend = () => {
        setIsPlaying(false);
      };
      
      speechUtterance.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        toast({
          title: "Speech Error",
          description: "There was an error during speech synthesis",
          variant: "destructive",
        });
      };
      
      setVoiceProgress(100);
      
      if (speechSynthesis.current) {
        speechSynthesis.current.speak(speechUtterance.current);
      }
      
      toast({
        title: "Narration Created",
        description: "Your mythological story is being narrated",
      });
    } catch (error) {
      console.error("Failed to generate voice narration:", error);
      toast({
        title: "Voice Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your narration",
        variant: "destructive",
      });
    } finally {
      setVoiceLoading(false);
      setVoiceProgress(0);
    }
  };

  const togglePlayPause = () => {
    if (!speechSynthesis.current) return;
    
    if (isPlaying) {
      speechSynthesis.current.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesis.current.paused) {
        speechSynthesis.current.resume();
      } else if (speechUtterance.current) {
        speechSynthesis.current.speak(speechUtterance.current);
      }
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg border border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary" />
            Generate Voice Narration
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="narration-voice" className="min-w-[80px]">Voice:</Label>
            <Select
              value={selectedVoice}
              onValueChange={setSelectedVoice}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {voiceProgress > 0 && <Progress value={voiceProgress} className="h-2" />}
        
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateVoice}
            disabled={voiceLoading}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {voiceLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Narration...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Generate Audio Narration
              </>
            )}
          </Button>
        </div>
      </div>

      {isPlaying !== null && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isPlaying ? 'bg-primary text-white' : ''}`}
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div>
              <p className="text-sm font-medium">Audio Narration</p>
              <p className="text-xs text-muted-foreground">
                {isPlaying ? "Playing..." : "Paused"}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Voice: {voices.find(v => v.id === selectedVoice)?.name || "Default"}
          </div>
        </div>
      )}
    </>
  );
};
