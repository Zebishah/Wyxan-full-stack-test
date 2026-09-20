import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ADDRESS_PATTERN } from '../../common/validation/address';

export class CreateSiteDto {
  @IsString()
  @Matches(ADDRESS_PATTERN, { message: 'Address must start with a letter or number and contain only letters, numbers, hyphens, or dots.' })
  address!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  author!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30000)
  html!: string;
}
