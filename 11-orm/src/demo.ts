import 'dotenv/config';
import { productRepo } from './repositories/product.repo.ts';

async function demo() {
  console.log('1. SAVE → вставлений запис:');
  const saved = await productRepo.save({
    name: 'Demo Product',
    price: 9.99,
    created_at: new Date(),
  });
  console.log(saved);

  console.log('\n2. FIND → масив об’єктів:');
  const all = await productRepo.find();
  console.log(all);

  console.log('\n3. UPDATE → оновлений запис:');
  const updated = await productRepo.update(saved.id, { price: 19.99 });
  console.log(updated);

  console.log('\n4. DELETE → виконано видалення');
  await productRepo.delete(saved.id);
  console.log('Record deleted');

  console.log('\n5. FINDONE → після видалення:');
  const after = await productRepo.findOne(saved.id);
  console.log(after);

  process.exit(0);
}

demo().catch(err => {
  console.error(err);
  process.exit(1);
});
