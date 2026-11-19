export interface ProjectInterface {
    id: number
    projectName: string 
    sprintNumber: number
    releaseNumber: number
    tag: string
    descrizione: string
    dataInserimento: string
    dataInvioManuali: string
    dataUltimaAnalisi?: string | null
    compliance?: number | null
    statoId?: number | null;
}
