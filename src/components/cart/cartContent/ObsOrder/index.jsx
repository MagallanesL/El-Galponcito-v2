import './obsOrder.css'

const ObsOrder = ({ obsOrder, setObsOrder }) => {
    return (
        <div className="obsOrder">
            {/* <label htmlFor="obsOrder">Observaciones:</label> */}
            <textarea
                id="obsOrder"
                placeholder="¿Alguna preferencia especial para tu pedido?"
                value={obsOrder}
                onChange={(e) => setObsOrder(e.target.value)}
            />
        </div>
    );
};

export default ObsOrder;
