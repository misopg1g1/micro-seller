export const TypeOrmTestingConfig = (): object => ({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  keepConnectionAlive: true,
});
