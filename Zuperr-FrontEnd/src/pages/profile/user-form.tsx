// import React from "react";

// function UserForm({

// }) {
//   return (
//     <div className="lg:col-span-1 h-fit overflow-x-auto whitespace-nowrap">
//       <h2 className="text-2xl font-bold">Quick Links</h2>
//       <div className="mt-6 border-b border-black relative">
//         <div className="flex gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2 scrollbar-none">
//           <button
//             onClick={() => setActiveSection("resume")}
//             className={`${
//               activeSection === "resume" ? "text-black" : "text-gray-400"
//             } flex justify-between font-semibold items-center w-auto px-3 py-2 rounded hover:bg-blue-100 bg-white shadow-sm`}
//           >
//             <span className="truncate">Resume Upload</span>
//           </button>
//           {profileSectionsConfig.map((section) => (
//             <button
//               key={section.id}
//               onClick={() => {
//                 setActiveSection(section.id);
//                 handleOpenDialog(section);
//               }}
//               className={`${
//                 activeSection === section.id ? "text-black" : "text-gray-400"
//               } flex justify-between font-semibold items-center w-auto px-3 py-2 rounded hover:bg-blue-100 bg-white shadow-sm`}
//             >
//               <span className="truncate">{section.title}</span>
//               {activeSection === section.id ? (
//                 <span className="absolute bottom-0 top-[2.8rem] left-6 w-24 h-[2.5px] rounded-sm bg-black" />
//               ) : activeSection === "resume" ? (
//                 <span className="absolute bottom-0 top-[2.8rem] left-6 w-24 h-[2.5px] rounded-sm bg-black" />
//               ) : (
//                 <></>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserForm;
