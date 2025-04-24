import { FiAlertCircle } from "react-icons/fi";

interface PendenciaModalProps {
  categorias: Array<{ sigla: string; categoria: string }>;
  onConfirm: (categorias: string[], observacoes: string) => void;
  onCancel: () => void;
}

export const PendenciaModal = ({ categorias, onConfirm, onCancel }: PendenciaModalProps) => {
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");

  const handleConfirm = () => {
    if (categoriasSelecionadas.length > 0 && observacoes.trim()) {
      onConfirm(categoriasSelecionadas, observacoes);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Adicionar Pendência</h3>
        </div>
        
        <div className="modal-body">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Categorias com Pendência
              <span className="text-xs text-gray-500 ml-1">(Selecione uma ou mais)</span>
            </label>
            <select
              multiple
              size={5}
              value={categoriasSelecionadas}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setCategoriasSelecionadas(options);
              }}
              className="modal-select"
            >
              {categorias.map((cat) => (
                <option key={cat.sigla} value={cat.sigla}>
                  {cat.categoria} ({cat.sigla})
                </option>
              ))}
            </select>
            {categoriasSelecionadas.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Selecionadas: </span>
                <span className="text-sm text-gray-600">
                  {categoriasSelecionadas.map(sigla => {
                    const cat = categorias.find(c => c.sigla === sigla);
                    return cat ? `${cat.categoria} (${sigla})` : sigla;
                  }).join(', ')}
                </span>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descrição da Pendência</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva detalhadamente o que precisa ser corrigido..."
              className="modal-textarea"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onCancel}
            className="btn btn-cancel"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            disabled={categoriasSelecionadas.length === 0 || !observacoes.trim()}
            className="btn btn-confirm"
          >
            Confirmar Pendência
          </button>
        </div>
      </div>
    </div>
  );
};                 