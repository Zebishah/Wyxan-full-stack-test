import { IsIn, IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ADDRESS_PATTERN } from '../../common/validation/address';

export class CreateVisitDto {
  @IsMongoId() personId!: string;
  @IsString() @Matches(ADDRESS_PATTERN, { message: 'Address must be a fictional identifier, not a URL.' }) address!: string;
  @IsString() @IsIn(['typed', 'link', 'back', 'forward', 'search', 'history']) source!: string;
  @IsString() @IsNotEmpty() title!: string;
}
