import { PartialType } from '@nestjs/swagger';
import { CreateCbtDto } from './create-cbt.dto';

export class UpdateCbtDto extends PartialType(CreateCbtDto) {}
