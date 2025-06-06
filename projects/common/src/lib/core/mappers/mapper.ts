/** Mapper of DTO to domain model. */
export type MapperFromDto<TDto, TDomain> = {

	/** Maps from DTO to domain model. */
	fromDto(dto: TDto): TDomain;
};

/** Mapper of domain model to DTO. */
export type MapperToDto<TDto, TModel> = {

	/** Maps from domain model to DTO. */
	toDto(model: TModel): TDto;
};

/** Mapper from DTO to domain model and vice versa. */
export type Mapper<TDto, TModel> = {} & MapperFromDto<TDto, TModel> & MapperToDto<TDto, TModel>;
