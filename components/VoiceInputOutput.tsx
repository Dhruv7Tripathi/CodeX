// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { Button } from '../components/ui/button';
// import { Mic, Square, Volume2 } from 'lucide-react';

// const VoiceInterface = () => {
//   const [text, setText] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

//   useEffect(() => {
//     // Initialize speech recognition
//     if ('webkitSpeechRecognition' in window) {
//       const recognitionInstance = new (window as any).webkitSpeechRecognition();
//       recognitionInstance.continuous = true;
//       recognitionInstance.interimResults = true;

//       recognitionInstance.onresult = (event: any) => {
//         const transcript = Array.from(event.results)
//           .map((result: any) => result[0].transcript)
//           .join('');
//         setText(transcript);
//       };

//       recognitionInstance.onerror = (event : any) => {
//         console.error('Speech recognition error:', event.error);
//         setIsRecording(false);
//       };

//       setRecognition(recognitionInstance);
//     }
//   }, []);

//   const startRecording = () => {
//     if (recognition) {
//       recognition.start();
//       setIsRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (recognition) {
//       recognition.stop();
//       setIsRecording(false);
//     }
//   };

//   const speakText = () => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   return (
//     <Card className="w-full max-w-2xl">
//       <CardHeader>
//         <CardTitle>Voice Interface</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex flex-col space-y-4">
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="w-full h-32 p-2 border rounded-md"
//             placeholder="Your text will appear here..."
//           />
//           <div className="flex space-x-4">
//             <Button
//               onClick={isRecording ? stopRecording : startRecording}
//               className={`flex items-center space-x-2 ${
//                 isRecording ? 'bg-red-500 hover:bg-red-600' : ''
//               }`}
//             >
//               {isRecording ? (
//                 <>
//                   <Square className="w-4 h-4" />
//                   <span>Stop Recording</span>
//                 </>
//               ) : (
//                 <>
//                   <Mic className="w-4 h-4" />
//                   <span>Start Recording</span>
//                 </>
//               )}
//             </Button>
//             <Button
//               onClick={speakText}
//               className="flex items-center space-x-2"
//               disabled={!text}
//             >
//               <Volume2 className="w-4 h-4" />
//               <span>Speak Text</span>
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default VoiceInterface;