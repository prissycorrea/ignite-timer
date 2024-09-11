import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function DefaultLayout() {
    return (
        <div>
           <Header />
           <Outlet /> {/*outlet serve para renderizar o componente filho, neste caso, o conteudo da pagina*/}
        </div>
    )
}