import { Outlet } from "react-router-dom";
import { LayoutContainer } from "./styles";
import { Header } from "../../components/Header/index.tsx";

export function DefaultLayout() {
    return (
        <LayoutContainer>
           <Header />
           <Outlet /> {/*outlet serve para renderizar o componente filho, neste caso, o conteudo da pagina*/}
        </LayoutContainer>
    )
}