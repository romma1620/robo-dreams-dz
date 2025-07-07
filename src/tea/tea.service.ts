import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Tea } from './tea.model';
import { CreateTeaDto, UpdateTeaDto } from './schemas/tea.schema';

@Injectable()
export class TeaService {
  private teas: Tea[] = [];

  async findAll(minRating?: number): Promise<Tea[]> {
    return this.teas.filter(
      t => minRating == null || (t.rating ?? 0) >= minRating,
    );
  }

  async findOne(id: string): Promise<Tea> {
    const tea = this.teas.find(t => t.id === id);
    if (!tea) {
      throw new NotFoundException(`Tea with id "${id}" not found`);
    }
    return tea;
  }

  async create(dto: CreateTeaDto): Promise<Tea> {
    const tea: Tea = {
      id: uuidv4(),
      ...dto,
    };
    this.teas.push(tea);
    return tea;
  }

  async update(id: string, dto: UpdateTeaDto): Promise<Tea> {
    const tea = await this.findOne(id);
    Object.assign(tea, dto);
    return tea;
  }

  async remove(id: string): Promise<void> {
    const index = this.teas.findIndex(t => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tea with id "${id}" not found`);
    }
    this.teas.splice(index, 1);
  }
}
