import {TableModel} from "@app/ui/components/table/model/table.model";
// {
//     "autoname": "Formulario Radicación PQRs-Radicado: 03052022000306 - Estado: 2- Manifestacion asignada",
//     "created_at": "2022-05-03T01:49:31.106653Z",
//     "kw": "FROM-EMAIL",
//     "kw_values": "no-reply@e-capture.co",
//     "priority": 1,
//     "username": "manager",
//     "w_type": "notification-email"
// }
export const styleTableConsoleNotifications: TableModel = {
  columns: [
    {
      label: 'Keyword',
    },
    {
      label: 'Valor',
    },
    {
      label: 'Prioridad',
    },
    {
      label: 'Autoname',
    },
    {
      label: 'Tipo Notificación',
    },
    {
      label: 'Usuario',
    },
    {
      label: 'Estado',
    },
    {
      label: 'Fecha creación',
    },
  ],
  buttonTittle: {
    showButton: true,
    label: 'Refrescar',
    route: ''
  },
  isSearch: true,
  dataSource: [],
  optionsStander: [],
}
