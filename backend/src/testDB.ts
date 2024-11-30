import prisma from './prismaClient';

async function testDB() {
  const newTable = await prisma.table.create({
    data: {
      name: 'Test Table',
      cells: {
        create: [
          { row: 1, column: 'A', value: '10', formula: null },
          { row: 1, column: 'B', value: '20', formula: 'A1 * 2' },
        ],
      },
    },
    include: { cells: true },
  });

  console.log(newTable);
}

testDB().catch((e) => console.error(e));
