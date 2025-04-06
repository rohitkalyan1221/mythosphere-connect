
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

  const generateContent = async (contentType: string, customPrompt?: string) => {
    if (contentType !== "dialogue" && !story) {
      toast({
        title: "No Story Found",
        description: "Please generate or select a story first",
        variant: "destructive",
      });
      return;
    }

    setGeneratingContent(true);
    
    try {
      // Base prompt with mythology context
      const mythology = story?.storyPrompt?.mythology || "generic";
      let prompt = "";
      
      switch (contentType) {
        case "quests":
          prompt = `Create 2-3 epic quests for a ${mythology} mythology setting based on this story: "${story.title}". 
          Format as markdown with # for quest titles, bullet points for objectives, obstacles, and potential twists.
          Include details about what characters might need to accomplish, challenges they'll face, and interesting plot twists.`;
          break;
          
        case "lore":
          prompt = `Expand the lore and worldbuilding of ${mythology} mythology for this story: "${story.title}".
          Format as markdown with sections for cosmic origins, age of creation, divine hierarchy, and sacred sites.
          Be detailed but concise, focusing on the most interesting mythological elements.`;
          break;
          
        case "npcs":
          prompt = `Create 3 detailed NPC character profiles for a ${mythology} mythology setting related to the story: "${story.title}".
          Format as markdown with # for character names, including their role, background story, and motivations.
          Make them feel authentic to ${mythology} mythology with appropriate traits and connections.`;
          break;
          
        case "dialogue":
          if (!customPrompt || customPrompt.trim() === "") {
            toast({
              title: "Input Required",
              description: "Please enter a character or scenario for dialogue generation",
              variant: "destructive",
            });
            setGeneratingContent(false);
            return;
          }
          
          prompt = `Create dialogue examples for a ${mythology} mythology character or scenario described as: "${customPrompt}".
          Format as markdown with sections for different conversation types (greeting, sharing knowledge, warning, etc).
          Include at least 2 alternative dialogue options for each type. Make the language feel authentic to ${mythology} mythology.`;
          break;
      }
      
      // Simulate API call (in a real implementation, this would call an AI API)
      // For now, we'll simulate with timed responses that match the expected format
      
      setTimeout(() => {
        let generatedContent = "";
        
        switch (contentType) {
          case "quests":
            generatedContent = generateQuestContent(mythology);
            setQuestDetails(generatedContent);
            break;
            
          case "lore":
            generatedContent = generateLoreContent(mythology);
            setLoreExpansion(generatedContent);
            break;
            
          case "npcs":
            generatedContent = generateNPCContent(mythology);
            setNpcBackstories(generatedContent);
            break;
            
          case "dialogue":
            generatedContent = generateDialogueContent(mythology, customPrompt || "");
            setDialogueAssistance(generatedContent);
            break;
        }
        
        setGeneratingContent(false);
        
        toast({
          title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Generated`,
          description: `New ${contentType} content has been created for your story!`,
        });
      }, 1500);
      
    } catch (error) {
      console.error(`Error generating ${contentType}:`, error);
      toast({
        title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Generation Failed`,
        description: "There was an error generating content. Please try again.",
        variant: "destructive",
      });
      setGeneratingContent(false);
    }
  };

  const generateQuestContent = (mythology: string) => {
    // Helper function to generate realistic quest content
    const quests = [
      {
        title: `The Lost Artifact of ${mythology}`,
        description: `An ancient artifact with the power to communicate with the ${mythology} gods has been lost for centuries. Rumors speak of its location in a forgotten temple deep within the wilderness.`,
        objectives: [
          "Find the hidden temple using the ancient map fragments",
          "Solve the riddle of the guardian statues to gain entry",
          "Navigate the trap-filled halls to reach the inner sanctum",
          "Retrieve the artifact without triggering the curse"
        ],
        obstacles: [
          `Temple is guarded by mythical beasts from ${mythology} legends`,
          "The artifact is protected by ancient magic that tests worthiness",
          "A rival seeker with dangerous allies is also searching for it",
          "The temple itself shifts and changes according to the phases of the moon"
        ],
        twists: [
          "The artifact is actually a trap set by trickster gods to identify hubristic mortals",
          "The true power of the artifact is revealed only to those with pure intentions",
          "The artifact can only be used once before returning to its resting place",
          "The artifact reveals a devastating truth about the protagonist's lineage"
        ]
      },
      {
        title: `Pilgrimage to the Sacred Mountain of ${mythology}`,
        description: `The highest peak in the land is said to be where mortals can speak directly to the gods of ${mythology}. A spiritual journey awaits those brave enough to make the climb.`,
        objectives: [
          "Gather the sacred offerings required for each of the shrines",
          "Cross the enchanted forest where spirits test your resolve",
          "Navigate the labyrinth of illusions that guards the mountain path",
          "Perform the ritual at the summit during the celestial alignment"
        ],
        obstacles: [
          "The path changes with each pilgrim, showing different challenges",
          "Spirits of failed pilgrims haunt the trails, seeking to turn you back",
          "Weather controlled by temperamental deities makes climbing dangerous",
          "Your own doubts and fears manifest as physical barriers"
        ],
        twists: [
          "The pilgrim discovers they have divine heritage upon reaching the summit",
          "The journey itself is the test, not reaching the destination",
          "What seems like the summit is actually just the beginning of the true quest",
          "The gods are no longer at the summit, but have left behind a crucial message"
        ]
      }
    ];
    
    return quests.map(quest => (
      `# ${quest.title}\n\n${quest.description}\n\n**Objectives:**\n${quest.objectives.map(obj => `• ${obj}`).join('\n')}\n\n` +
      `**Obstacles:**\n${quest.obstacles.map(obs => `• ${obs}`).join('\n')}\n\n` +
      `**Twists:**\n${quest.twists.map(twist => `• ${twist}`).join('\n')}`
    )).join('\n\n---\n\n');
  };
  
  const generateLoreContent = (mythology: string) => {
    // Helper function to generate realistic lore content
    return `# The Cosmic Origins of ${mythology}\n\n` +
    `In the beginning, before time was measured, the universe was an infinite void of potential. From this primordial emptiness emerged the first beings of ${mythology} mythology. These entities were not gods as mortals would come to understand them, but rather forces of nature and cosmic principles personified.\n\n` +
    `## The Age of Creation\n\n` +
    `The first gods shaped the world from raw elements, establishing the fundamental laws that would govern existence. Mountains rose from the plains as divine fingers sculpted the land. Oceans filled the basins as celestial tears fell from the heavens. Forests sprouted from divine breath, and animals emerged from divine dreams.\n\n` +
    `## The Divine Hierarchy\n\n` +
    `As civilization developed, so too did the pantheon evolve. Lesser deities arose to oversee specific domains of mortal life. A complex hierarchy formed, with chief deities presiding over cosmic forces, while their descendants managed more specific aspects of the world. Divine conflicts and alliances shaped the mythology that mortals would come to know and worship.\n\n` +
    `## Sacred Sites\n\n` +
    `* **Temple of Eternal Flame**: Built where the sun deity first touched earth, its central fire has burned uninterrupted for millennia. Priests maintain the flame and interpret the patterns within it to predict future events.\n\n` +
    `* **The Whispering Grove**: A forest where trees are said to contain the spirits of ancestors who share wisdom with those who know how to listen. The oldest tree at its center is believed to be the first living being created.\n\n` +
    `* **Mountain of Divine Assembly**: The tallest peak in the land, believed to be where gods gather to determine the fate of mortals. Its summit is perpetually shrouded in clouds, and those who climb too high never return the same, if they return at all.\n\n` +
    `* **The Ethereal Waters**: A lake whose waters are said to reflect not just the physical world but glimpses of other realms. On certain nights when stars align, the veil between worlds thins, and visitors report seeing incredible visions in its depths.`;
  };
  
  const generateNPCContent = (mythology: string) => {
    // Helper function to generate realistic NPC content
    return `# Key Characters in ${mythology} Mythology\n\n` +
    `## The Oracle of Whispered Truths\n\n` +
    `**Name**: Calantha\n\n` +
    `**Role**: Seer, Keeper of Hidden Knowledge\n\n` +
    `**Background**: Born during a rare cosmic alignment, Calantha was touched by divine sight from infancy. When she spoke her first words at age three, she predicted a devastating flood that would come to pass a month later. Her family, recognizing her gift, brought her to the Temple of Foresight where she trained under aging oracles. Now in her sixth decade, she serves as the primary conduit between mortals and the divine realm, though the weight of her visions has left her physically frail but spiritually formidable.\n\n` +
    `**Motivation**: Calantha seeks to interpret the often cryptic messages from the gods correctly, as misinterpretations have led to tragedy in the past. She carries the burden of a prophecy misunderstood in her youth that resulted in a needless war. She now trains promising young seers to understand that divine messages often have multiple meanings.\n\n` +
    `---\n\n` +
    `## The Fallen Champion\n\n` +
    `**Name**: Theron\n\n` +
    `**Role**: Warrior, Redemption Seeker\n\n` +
    `**Background**: Once the champion of the king, Theron was undefeated in battle until pride led him to challenge a minor deity to combat. His defeat was humiliating and public, with the deity sparing his life but cursing his sword arm to wither. Cast out from the royal guard, he now wanders the land seeking a way to lift his curse and restore his honor. His journey has taught him humility and given him insight into the suffering of common people that he never noticed from his privileged position.\n\n` +
    `**Motivation**: Beyond his personal redemption, Theron has come to recognize how his arrogance harmed others. He now intervenes in conflicts to protect the innocent, using his remaining strength and battle wisdom to compensate for his weakened sword arm. He secretly hopes that selfless service might catch the attention of the gods and earn him forgiveness.\n\n` +
    `---\n\n` +
    `## The Divine Intermediary\n\n` +
    `**Name**: Lysander\n\n` +
    `**Role**: Priest, Diplomat between Divine Factions\n\n` +
    `**Background**: Born to a family that has served in the temples for generations, Lysander showed uncommon empathy and understanding from childhood. While studying ancient texts, he discovered forgotten rituals that allowed him to communicate directly with multiple deities, even those in conflict. This rare ability has made him a crucial mediator when divine disputes threaten to spill into the mortal realm. However, each communication takes a physical toll, and the opposing divine energies have left visible marks on his skin that glow during his rituals.\n\n` +
    `**Motivation**: Lysander believes in the fundamental interconnectedness of all deities in the pantheon, despite their conflicts. He works tirelessly to prevent divine wars that would devastate the mortal world, often at great personal risk as he navigates the dangerous politics of the gods. He hopes to eventually establish a lasting covenant between the major divine powers that would protect mortals from becoming collateral damage in divine conflicts.`;
  };
  
  const generateDialogueContent = (mythology: string, prompt: string) => {
    // Helper function to generate realistic dialogue content
    return `# Dialogue for: ${prompt} in ${mythology} Mythology\n\n` +
    `## Casual Greeting\n\n` +
    `**Character**: "The gods smile upon our meeting, traveler. What brings you to these lands touched by divine favor?"\n\n` +
    `**Alternative**: "I see the mark of destiny upon you. Few wander these paths without purpose, especially in these times of cosmic significance."\n\n` +
    `## Sharing Knowledge\n\n` +
    `**Character**: "The ancient texts speak of a time when the ${mythology} gods walked among us. The mountains to the east still bear their footprints, if you know where to look. I could show you, for a price that may not be measured in gold."\n\n` +
    `**Alternative**: "Listen carefully, for this knowledge has been passed through my lineage since the Great Separation, when gods retreated from mortal sight. What I tell you now is known to few living souls, and fewer still understand its significance."\n\n` +
    `## Issuing Warning\n\n` +
    `**Character**: "The path you seek is shrouded in divine mist. Many have entered, believing themselves worthy, only to return as hollow echoes of themselves... if they return at all. Are you certain your resolve will not falter when faced with truths beyond mortal comprehension?"\n\n` +
    `**Alternative**: "I would caution against proceeding further. The gods test mortals not to reward them, but to remind them of their place in the cosmic order. I have seen what becomes of those who fail such tests, and that fate is one I would not wish upon even my enemies."\n\n` +
    `## Offering Aid\n\n` +
    `**Character**: "Perhaps our meeting is not mere chance, but ordained by forces beyond our understanding. I possess skills that may aid your journey, if you would accept them. The gods have shown me visions of what you seek, though the path remains shrouded."\n\n` +
    `**Alternative**: "The constellations aligned when you approached. This suggests our fates are intertwined, at least for a time. I shall accompany you to the shrine, though what comes after must be of your own doing. Some burdens cannot be shared, even by the willing."\n\n` +
    `## In Conflict\n\n` +
    `**Character**: "You tread upon sacred ground with unclean intentions! The gods have shown me your heart's darkness. Depart, or face their judgment through my hands! I am but their instrument, and I strike without hesitation when the divine will demands it."\n\n` +
    `**Alternative**: "Do not mistake my patience for weakness. I have communed with beings whose whispers can turn mountains to dust. This is your final warning—the next words from my lips will be the ancient incantation that calls down their wrath upon the unworthy."`;
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
                onClick={() => generateContent("quests")} 
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
                onClick={() => generateContent("lore")} 
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
                onClick={() => generateContent("npcs")} 
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
                  onClick={() => generateContent("dialogue", npcDialoguePrompt)} 
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
