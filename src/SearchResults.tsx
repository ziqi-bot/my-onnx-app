




// import React from 'react';
// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

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
// }

// const classNames = ["pedestrian", "biker", "skater", "cart", "car", "bus"];

// const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, mode }) => {
//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>{mode === 'latest' ? 'Class' : 'File'}</TableCell>
//           <TableCell>Details</TableCell>
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
//             </TableRow>
//           ))
//         )}
//       </TableBody>
//     </Table>
//   );
// };

// export default SearchResults;








// {
//   "id": 2,
//   "pedestrian": 11,
//   "biker": 1,
//   "skater": 0,
//   "cart": 0,
//   "car": 2,
//   "bus": 0,
//   "created_at": "2024-06-27T15:46:32.943Z"
// }






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
  searchResults: Result[];
  mode: 'latest' | 'all';
  onDelete: (id: number) => void;
}

const classNames = ["pedestrian", "biker", "skater", "cart", "car", "bus"];

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, mode, onDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{mode === 'latest' ? 'Class' : 'File'}</TableCell>
          <TableCell>Details</TableCell>
          {mode === 'all' && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {mode === 'latest' ? (
          classNames.map((className, index) => (
            <TableRow key={index}>
              <TableCell>{className}</TableCell>
              <TableCell>{searchResults.length > 0 ? (searchResults[0] as any)[className] : 0}</TableCell>
            </TableRow>
          ))
        ) : (
          searchResults.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.id}</TableCell>
              <TableCell>
                {classNames.map((className) => (
                  <div key={className}>
                    {className}: {(result as any)[className] !== undefined ? (result as any)[className] : 0}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => onDelete(result.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SearchResults;
