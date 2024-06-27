

// import React from 'react';
// import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';

// interface Result {
//   id: number;
//   pedestrian: number;
//   biker: number;
//   skater: number;
//   cart: number;
//   car: number;
//   bus: number;
//   created_at: string;
// }

// interface SearchResultsProps {
//   searchResults: Result[];
//   mode: 'latest' | 'all';
//   onDelete: (id: number) => void;
// }

// const classNames = ["pedestrian", "biker", "skater", "cart", "car", "bus"];

// const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, mode, onDelete }) => {
//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>{mode === 'latest' ? 'Class' : 'File'}</TableCell>
//           <TableCell>Details</TableCell>
//           {mode === 'all' && <TableCell>Actions</TableCell>}
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {mode === 'latest' ? (
//           classNames.map((className, index) => (
//             <TableRow key={index}>
//               <TableCell>{className}</TableCell>
//               <TableCell>{searchResults.length > 0 ? (searchResults[0] as any)[className] : 0}</TableCell>
//             </TableRow>
//           ))
//         ) : (
//           searchResults.map((result, index) => (
//             <TableRow key={index}>
//               <TableCell>{result.id}</TableCell>
//               <TableCell>
//                 {classNames.map((className) => (
//                   <div key={className}>
//                     {className}: {(result as any)[className] !== undefined ? (result as any)[className] : 0}
//                   </div>
//                 ))}
//               </TableCell>
//               <TableCell>
//                 <Button variant="contained" color="secondary" onClick={() => onDelete(result.id)}>
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))
//         )}
//       </TableBody>
//     </Table>
//   );
// };

// export default SearchResults;






















import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';

interface Result {
  id: number;
  pedestrian: number;
  biker: number;
  skater: number;
  cart: number;
  car: number;
  bus: number;
  created_at: string;
}

interface SearchResultsProps {
  searchResults: Result[] | Result;
  mode: 'latest' | 'all';
  onDelete: (id: number) => void;
}

const classNames = ["pedestrian", "biker", "skater", "cart", "car", "bus"];

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, mode, onDelete }) => {
  if (mode === 'latest' && !Array.isArray(searchResults)) {
    const latestResult = searchResults as Result;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classNames.map((className, index) => (
            <TableRow key={index}>
              <TableCell>{className}</TableCell>
              <TableCell>{latestResult[className as keyof Result]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (Array.isArray(searchResults)) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.id}</TableCell>
              <TableCell>
                {classNames.map((className) => (
                  <div key={className}>
                    {className}: {result[className as keyof Result] !== undefined ? result[className as keyof Result] : 0}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => onDelete(result.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return null;
};

export default SearchResults;
