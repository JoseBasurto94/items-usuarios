export interface ErrorAsignacion {
  success: boolean;
  mensaje: string;
  codigo: 'USUARIO_SATURADO' | 'USUARIO_NO_OPTIMO' | 'ITEM_NO_ENCONTRADO' | 'ERROR_INTERNO' | 'REGLA_NEGOCIO';
  usuariosAlternativos?: string[];
  usuarioSugerido?: string;
  itemsAltamenteRelevantes?: number;
}