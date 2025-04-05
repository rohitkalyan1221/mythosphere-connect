
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryResponse } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Compass, Scroll, Users, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StoryContentProps {
  story: StoryResponse;
  showArcsView: boolean;
  setShowArcsView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StoryContent: React.FC<StoryContentProps> = ({ 
  story, 
  showArcsView, 
  setShowArcsView 
}) => {
  const [activeTab, setActiveTab] = useState<string>("story");
  const [generatingContent, setGeneratingContent] = useState<boolean>(false);
  const [questDetails, setQuestDetails] = useState<string>("");
  const [loreExpansion, setLoreExpansion] = useState<string>("");
  const [npcBackstories, setNpcBackstories] = useState<string>("");
  const [dialogueAssistance, setDialogueAssistance] = useState<string>("");
  const [npcDialoguePrompt, setNpcDialoguePrompt] = useState<string>("");

  const generateQuestDetails = () => {
    setGeneratingContent(true);
    // This would normally be an API call to an AI model
    setTimeout(() => {
      const quests = [
        {
          title: "The Lost Artifact of " + story.storyPrompt?.mythology,
          description: "Recover an ancient artifact that holds the power to communicate with the gods.",
          objectives: ["Find the hidden temple", "Solve the riddle of the guardians", "Retrieve the artifact without triggering the curse"],
          obstacles: ["Temple is guarded by mythical beasts", "The artifact is protected by ancient magic", "A rival seeker is also searching for it"],
          twists: ["The artifact is actually a trap set by trickster gods", "The true power of the artifact is revealed only to those with pure intentions"]
        },
        {
          title: "Pilgrimage to the Sacred Mountain",
          description: "Embark on a spiritual journey to reach the peak where mortals can speak to the gods.",
          objectives: ["Cross the enchanted forest", "Navigate the labyrinth of illusions", "Perform the ritual at the summit"],
          obstacles: ["The path changes with the phases of the moon", "Spirits of failed pilgrims haunt the trails", "Weather controlled by temperamental deities"],
          twists: ["The pilgrim discovers they have divine heritage", "The journey itself is the test, not reaching the destination"]
        }
      ];
      
      const questText = quests.map(quest => (
        `# ${quest.title}\n\n${quest.description}\n\n**Objectives:**\n${quest.objectives.map(obj => `• ${obj}`).join('\n')}\n\n` +
        `**Obstacles:**\n${quest.obstacles.map(obs => `• ${obs}`).join('\n')}\n\n` +
        `**Twists:**\n${quest.twists.map(twist => `• ${twist}`).join('\n')}`
      )).join('\n\n---\n\n');
      
      setQuestDetails(questText);
      setGeneratingContent(false);
      toast({
        title: "Quests Generated",
        description: "New adventure paths have been created!",
      });
    }, 1500);
  };

  const expandLore = () => {
    setGeneratingContent(true);
    // This would normally be an API call to an AI model
    setTimeout(() => {
      const mythology = story.storyPrompt?.mythology || "Ancient";
      const loreText = `# The Cosmic Origins\n\nIn the beginning, before time was measured, the universe was an infinite void. From this primordial emptiness emerged the primordial beings of ${mythology} mythology. These entities were not gods as mortals would come to understand them, but rather forces of nature and cosmic principles personified.\n\n` +
      `## The Age of Creation\n\nThe first gods shaped the world from raw elements, establishing the fundamental laws that would govern existence. Mountains rose from the plains as divine fingers sculpted the land. Oceans filled the basins as celestial tears fell from the heavens. Forests sprouted from divine breath, and animals emerged from divine dreams.\n\n` +
      `## The Divine Hierarchy\n\nAs civilization developed, so too did the pantheon evolve. Lesser deities arose to oversee specific domains of mortal life. A complex hierarchy formed, with chief deities presiding over cosmic forces, while their descendants managed more specific aspects of the world.\n\n` +
      `## Sacred Sites\n\n* **Temple of Eternal Flame**: Built where the sun god first touched earth, its central fire has burned uninterrupted for millennia.\n* **The Whispering Grove**: A forest where trees are said to contain the spirits of ancestors who share wisdom with those who know how to listen.\n* **Mountain of Divine Assembly**: The tallest peak in the land, believed to be where gods gather to determine the fate of mortals.`;
      
      setLoreExpansion(loreText);
      setGeneratingContent(false);
      toast({
        title: "Lore Expanded",
        description: "The mythological world has been enriched with new details!",
      });
    }, 1500);
  };

  const generateNpcBackstories = () => {
    setGeneratingContent(true);
    // This would normally be an API call to an AI model
    setTimeout(() => {
      const mythology = story.storyPrompt?.mythology || "Ancient";
      const npcText = `# Key Characters in ${mythology} Mythology\n\n## The Oracle of Whispered Truths\n\n**Name**: Calantha\n\n**Role**: Seer, Keeper of Hidden Knowledge\n\n**Background**: Born during a rare cosmic alignment, Calantha was touched by divine sight from infancy. When she spoke her first words at age three, she predicted a devastating flood that would come to pass a month later. Her family, recognizing her gift, brought her to the Temple of Foresight where she trained under aging oracles. Now in her sixth decade, she serves as the primary conduit between mortals and the divine realm.\n\n**Motivation**: Calantha seeks to interpret the often cryptic messages from the gods correctly, as misinterpretations have led to tragedy in the past. She carries the burden of a prophecy misunderstood in her youth that resulted in a needless war.\n\n---\n\n## The Fallen Champion\n\n**Name**: Theron\n\n**Role**: Warrior, Redemption Seeker\n\n**Background**: Once the champion of the king, Theron was undefeated in battle until pride led him to challenge a minor deity to combat. His defeat was humiliating and public, with the deity sparing his life but cursing his sword arm to wither. Cast out from the royal guard, he now wanders the land seeking a way to lift his curse and restore his honor.\n\n**Motivation**: Beyond his personal redemption, Theron has come to recognize how his arrogance harmed others. He now intervenes in conflicts to protect the innocent, using his remaining strength and battle wisdom to compensate for his weakened sword arm.\n\n---\n\n## The Divine Intermediary\n\n**Name**: Lysander\n\n**Role**: Priest, Diplomat between Divine Factions\n\n**Background**: Born to a family that has served in the temples for generations, Lysander showed uncommon empathy and understanding from childhood. While studying ancient texts, he discovered forgotten rituals that allowed him to communicate directly with multiple deities, even those in conflict. This rare ability has made him a crucial mediator when divine disputes threaten to spill into the mortal realm.\n\n**Motivation**: Lysander believes in the fundamental interconnectedness of all deities in the pantheon, despite their conflicts. He works tirelessly to prevent divine wars that would devastate the mortal world, often at great personal risk as he navigates the dangerous politics of the gods.`;
      
      setNpcBackstories(npcText);
      setGeneratingContent(false);
      toast({
        title: "Characters Created",
        description: "New characters with rich backstories have been generated!",
      });
    }, 1500);
  };

  const generateDialogueAssistance = () => {
    if (!npcDialoguePrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a character or scenario for dialogue generation",
        variant: "destructive",
      });
      return;
    }
    
    setGeneratingContent(true);
    // This would normally be an API call to an AI model
    setTimeout(() => {
      const mythology = story.storyPrompt?.mythology || "Ancient";
      const dialogueText = `# Dialogue for: ${npcDialoguePrompt}\n\n## Casual Greeting\n\n**Character**: "The gods smile upon our meeting, traveler. What brings you to these lands touched by divine favor?"\n\n**Alternative**: "I see the mark of destiny upon you. Few wander these paths without purpose."\n\n## Sharing Knowledge\n\n**Character**: "The ancient texts speak of a time when the ${mythology} gods walked among us. The mountains to the east still bear their footprints, if you know where to look."\n\n**Alternative**: "Listen carefully, for this knowledge has been passed through my lineage since the Great Separation, when gods retreated from mortal sight."\n\n## Issuing Warning\n\n**Character**: "The path you seek is shrouded in divine mist. Many have entered, believing themselves worthy, only to return as hollow echoes of themselves... if they return at all."\n\n**Alternative**: "I would caution against proceeding further. The gods test mortals not to reward them, but to remind them of their place in the cosmic order."\n\n## Offering Aid\n\n**Character**: "Perhaps our meeting is not mere chance, but ordained by forces beyond our understanding. I possess skills that may aid your journey, if you would accept them."\n\n**Alternative**: "The constellations aligned when you approached. This suggests our fates are intertwined, at least for a time. I shall accompany you to the shrine."\n\n## In Conflict\n\n**Character**: "You tread upon sacred ground with unclean intentions! The gods have shown me your heart's darkness. Depart, or face their judgment through my hands!"\n\n**Alternative**: "Do not mistake my patience for weakness. I have communed with beings whose whispers can turn mountains to dust. This is your final warning."`;
      
      setDialogueAssistance(dialogueText);
      setGeneratingContent(false);
      toast({
        title: "Dialogue Generated",
        description: "Character dialogue suggestions have been created!",
      });
    }, 1500);
  };

  const renderStoryContent = () => {
    if (!story) return null;

    if (showArcsView && story.storyArcs && story.storyArcs.length > 0) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {story.storyArcs.map((arc, index) => (
            <AccordionItem key={index} value={`arc-${index}`} className="border-b border-primary/10">
              <AccordionTrigger className="text-md font-medium hover:text-primary">
                {arc.title}
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                {arc.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }

    return (
      <div className="prose dark:prose-invert max-w-none">
        {story.story.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>
    );
  };

  const renderMarkdownContent = (content: string) => {
    if (!content) return <div className="text-center text-muted-foreground py-8">No content generated yet</div>;
    
    // Basic markdown to JSX conversion for our simple cases
    const sections = content.split('\n\n');
    return (
      <div className="prose dark:prose-invert max-w-none">
        {sections.map((section, i) => {
          if (section.startsWith('# ')) {
            return <h1 key={i} className="text-2xl font-bold mb-4">{section.substring(2)}</h1>;
          } else if (section.startsWith('## ')) {
            return <h2 key={i} className="text-xl font-bold mb-3">{section.substring(3)}</h2>;
          } else if (section.startsWith('**') && section.endsWith('**')) {
            return <p key={i} className="font-bold mb-2">{section.substring(2, section.length - 2)}</p>;
          } else if (section.includes('\n• ')) {
            const [title, ...items] = section.split('\n• ');
            return (
              <div key={i} className="mb-4">
                <p className="mb-2">{title}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (section === '---') {
            return <hr key={i} className="my-4 border-primary/20" />;
          } else {
            return <p key={i} className="mb-4">{section}</p>;
          }
        })}
      </div>
    );
  };

  return (
    <>
      {story.storyArcs && story.storyArcs.length > 0 && (
        <div className="flex items-center justify-end space-x-2 mb-4">
          <Label htmlFor="show-arcs" className="text-sm">Show as Story Arcs</Label>
          <Switch
            id="show-arcs"
            checked={showArcsView}
            onCheckedChange={setShowArcsView}
          />
        </div>
      )}
      
      <div className="bg-card rounded-lg shadow-inner border border-accent/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full rounded-t-lg rounded-b-none bg-muted/50">
            <TabsTrigger value="story" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Story</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-1">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="lore" className="flex items-center gap-1">
              <Scroll className="h-4 w-4" />
              <span className="hidden sm:inline">Lore</span>
            </TabsTrigger>
            <TabsTrigger value="npcs" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">NPCs</span>
            </TabsTrigger>
            <TabsTrigger value="dialogue" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Dialogue</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="story" className="p-4">
            <ScrollArea className="h-[350px] pr-4">
              {renderStoryContent()}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="quests" className="p-4">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={generateQuestDetails} 
                disabled={generatingContent} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                {generatingContent ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Compass className="h-4 w-4" />
                    <span>Generate Quests</span>
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="h-[300px] pr-4">
              {renderMarkdownContent(questDetails)}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="lore" className="p-4">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={expandLore} 
                disabled={generatingContent} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                {generatingContent ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Scroll className="h-4 w-4" />
                    <span>Expand Lore</span>
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="h-[300px] pr-4">
              {renderMarkdownContent(loreExpansion)}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="npcs" className="p-4">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={generateNpcBackstories} 
                disabled={generatingContent} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                {generatingContent ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Create Characters</span>
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="h-[300px] pr-4">
              {renderMarkdownContent(npcBackstories)}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="dialogue" className="p-4">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="dialogue-prompt" className="mb-2 block text-sm">Character or Scenario</Label>
                  <Textarea 
                    id="dialogue-prompt"
                    placeholder="Enter a character (e.g., 'Temple priestess') or scenario (e.g., 'Meeting a divine messenger')"
                    value={npcDialoguePrompt}
                    onChange={(e) => setNpcDialoguePrompt(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <Button 
                  onClick={generateDialogueAssistance} 
                  disabled={generatingContent} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 mb-0.5"
                >
                  {generatingContent ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      <span>Generate Dialogue</span>
                    </>
                  )}
                </Button>
              </div>
              <ScrollArea className="h-[250px] pr-4">
                {renderMarkdownContent(dialogueAssistance)}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
