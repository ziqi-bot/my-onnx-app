// import React from 'react';
// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

// interface SearchResultsProps {
//   searchResults: any[];
// }

// const SearchResults: React.FC<SearchResultsProps> = ({ searchResults }) => {
//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>File</TableCell>
//           <TableCell>Details</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {searchResults.map((result, index) => (
//           <TableRow key={index}>
//             <TableCell>{result.filePath || result}</TableCell>
//             <TableCell>{Array.isArray(result.content) ? result.content.join(', ') : ''}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

// export default SearchResults;

















import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

interface SearchResultsProps {
  searchResults: any[];
  mode: 'latest' | 'all';
}

const classNames = ["pedestrian", "biker", "skater", "cart", "car", "bus"];

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, mode }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{mode === 'latest' ? 'Class' : 'File'}</TableCell>
          <TableCell>Details</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {mode === 'latest' ? (
          classNames.map((className, index) => (
            <TableRow key={index}>
              <TableCell>{className}</TableCell>
              <TableCell>{searchResults.length > 0 ? searchResults[index] : 0}</TableCell>
            </TableRow>
          ))
        ) : (
          searchResults.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.filePath || result}</TableCell>
              <TableCell>
                {classNames.map((className, classIndex) => (
                  <div key={className}>
                    {className}: {result.content && result.content[classIndex] !== undefined ? result.content[classIndex] : 0}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SearchResults;
