import prisma from '../prismaClient';

const formulas = [
  {
    name: "=SUM(A1:A10)",
    implementation: "+A1+A2+A3+...+A10",
    description: "Calculates the sum of the range A1 to A10.",
  },
  {
    name: "=AVERAGE(B1:B10)",
    implementation: "+(B1+B2+B3+...+B10)/10",
    description: "Calculates the average of the range B1 to B10.",
  },
  {
    name: "=MAX(C1:C10)",
    implementation: "=MAX(C1, C2, C3, ..., C10)",
    description: "Finds the maximum value in the range C1 to C10.",
  },
  {
    name: "=MIN(D1:D10)",
    implementation: "=MIN(D1, D2, D3, ..., D10)",
    description: "Finds the minimum value in the range D1 to D10.",
  },
  {
    name: '=IF(E1>100, "Greater than 100", "Less than or equal to 100")',
    implementation: 'E1 > 100 ? "Greater than 100" : "Less than or equal to 100"',
    description: "Checks if the value in E1 is greater than 100 and returns the appropriate text.",
  },
  {
    name: '=CONCATENATE(F1, " ", G1)',
    implementation: 'F1 + " " + G1',
    description: "Concatenates the values in F1 and G1 with a space in between.",
  },
  {
    name: "=DATE(2024, 12, 31)",
    implementation: "new Date(2024, 11, 31)",
    description: "Creates a date object for December 31, 2024.",
  },
  {
    name: "=TODAY()",
    implementation: "new Date().toISOString().slice(0, 10)",
    description: "Returns the current date.",
  },
  {
    name: "=VLOOKUP(H1, A1:B10, 2, FALSE)",
    implementation: "Searches for H1 in the first column of A1:B10 and returns the corresponding value in the second column.",
    description: "Looks up a value in the first column of a range and returns a value in the same row from another column.",
  },
  {
    name: '=SUBSTITUTE(I1, "old", "new")',
    implementation: 'I1.replace("old", "new")',
    description: "Replaces occurrences of 'old' with 'new' in the value of I1.",
  },
  {
    name: '=TEXT(A1, "0.00")',
    implementation: "A1.toFixed(2)",
    description: "Formats the value in A1 to two decimal places.",
  },
  {
    name: "=TRIM(J1)",
    implementation: "J1.trim()",
    description: "Removes all extra spaces from the text in J1.",
  },
  {
    name: "=ROUND(K1, 2)",
    implementation: "Math.round(K1 * 100) / 100",
    description: "Rounds the value in K1 to two decimal places.",
  },
  {
    name: "=DAY(L1)",
    implementation: "new Date(L1).getDate()",
    description: "Returns the day of the month for the date in L1.",
  },
  {
    name: "=MONTH(M1)",
    implementation: "new Date(M1).getMonth() + 1",
    description: "Returns the month number for the date in M1.",
  },
  {
    name: "=YEAR(N1)",
    implementation: "new Date(N1).getFullYear()",
    description: "Returns the year for the date in N1.",
  },
  {
    name: "=LOOKUP(O1, A:A, B:B)",
    implementation: "Analogous to the LOOKUP function for finding a value.",
    description: "Finds the value of O1 in column A and returns the corresponding value from column B.",
  },
  {
    name: "=VALUE(P1)",
    implementation: "Number(P1)",
    description: "Converts text in P1 to a number.",
  },
  {
    name: "=COUNT(Q1:Q10)",
    implementation: "Counts all numeric values in Q1:Q10.",
    description: "Counts the number of numeric entries in the range Q1:Q10.",
  },
  {
    name: '=COUNTIF(R:R, ">100")',
    implementation: "Counts all values in R that are greater than 100.",
    description: "Counts the number of cells in column R that are greater than 100.",
  },
  {
    name: "=PRODUCT(S2:S5)",
    implementation: "Multiplies all numbers in S2:S5.",
    description: "Calculates the product of all values in the range S2:S5.",
  },
  {
    name: "=VAR(T2:T10)",
    implementation: "Calculates the variance of T2:T10.",
    description: "Calculates the variance of values in the range T2:T10.",
  },
  {
    name: "=SQRT(U2)",
    implementation: "Math.sqrt(U2)",
    description: "Returns the square root of the value in U2.",
  },
  {
    name: '=REPLACE(V2, 5, 3, "new")',
    implementation: 'V2.replace(V2.slice(4, 7), "new")',
    description: "Replaces part of the text in V2 starting at position 5 for 3 characters with 'new'.",
  },
  {
    name: '=FIND("text", W2)',
    implementation: "W2.indexOf('text')",
    description: "Finds the position of 'text' within the string in W2.",
  },
  {
    name: "=RIGHT(X2, 5)",
    implementation: "X2.slice(-5)",
    description: "Returns the last 5 characters from the string in X2.",
  },
  {
    name: "=LEFT(Y2, 3)",
    implementation: "Y2.slice(0, 3)",
    description: "Returns the first 3 characters from the string in Y2.",
  },
  {
    name: "=TEXT(A3, 'DD.MM.YYYY')",
    implementation: "Formats the date in A3 to 'DD.MM.YYYY'.",
    description: "Formats the date in A3 to a specific string format.",
  },
  {
    name: "=COUNTA(A:A)",
    implementation: "Counts all non-empty cells in A.",
    description: "Counts the number of non-empty cells in column A.",
  },
  {
    name: '=AVERAGEIF(B:B, ">50", B:B)',
    implementation: "Calculates the average of values in B greater than 50.",
    description: "Calculates the average of values greater than 50 in column B.",
  },
  {
    name: '=SUMIF(C:C, ">100", C:C)',
    implementation: "Sums all values in C greater than 100.",
    description: "Sums values greater than 100 in column C.",
  },
  {
    name: "=COUNTBLANK(D:D)",
    implementation: "Counts all blank cells in D.",
    description: "Counts the blank cells in column D.",
  },
  {
    name: "=ISNUMBER(E2)",
    implementation: "Checks if E2 contains a number.",
    description: "Returns TRUE if the value in E2 is numeric.",
  },
  {
    name: "=NOW()",
    implementation: "new Date()",
    description: "Returns the current date and time.",
  },
  {
    name: '=TEXTJOIN(",", TRUE, F:F)',
    implementation: "Joins text in F with a comma separator.",
    description: "Joins text from column F with a comma separator.",
  },
  {
    name: "=UNIQUE(G:G)",
    implementation: "Returns unique values from G.",
    description: "Returns unique values from column G.",
  },
  {
    name: "=FILTER(H:H, H:H<>\"\")",
    implementation: "Filters out blank values in H.",
    description: "Filters out blank values from column H.",
  },
  {
    name: "=SORT(I:I)",
    implementation: "Sorts the values in I.",
    description: "Sorts values in column I in ascending order.",
  },
];


const seedFormulas = async () => {
  try {
    for (const formula of formulas) {
      await prisma.customFormula.create({
        data: formula,
      });
    }
    console.log('Formulas seeded successfully');
  } catch (error) {
    console.error('Error seeding formulas:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedFormulas();
