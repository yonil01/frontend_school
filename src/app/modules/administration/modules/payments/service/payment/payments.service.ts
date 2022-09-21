import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Payment, Response, PaymentRole, NewPaymentSecurityEntity, NewPaymentAttribute } from '@app/core/models';
import { Observable } from 'rxjs';
import {
  GetPaymentsQuery,
  GetPaymentByIDQuery,
  CreatePaymentQuery,
  UpdatePaymentQuery,
  DeletePaymentQuery,
  BlockPaymentQuery,
  UnBlockPaymentQuery,
  LogoutPaymentQuery,
  GetPaymentsQueryCpy,
  //GetRoles,
  GetRolesById,
  UpdatePasswordByAdministratorQuery,
  ChangePassPayment,
  CreatePaymentsRolesQuery,
  GetPaymentsByRolesAllowQuery,
  GetRolesAllowByPaymentQuery,
  GetPaymentsRolesByPaymentIDQuery,
  DeletePaymentsRolesQuery,
  CreatePaymentsAttributeQuery,
  CreatePaymentsSecurityEntityQuery,
  DeletePaymentsSecurityEntityQuery,
  DeletePaymentsAttributeQuery, GetPaymentByName, activeQueryPayment,
} from '@app/modules/administration/modules/payments/service/payment/payments.queries.service';
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(
    private getPaymentsQuery: GetPaymentsQuery,
    private getPaymentsByRolesAllowQuery: GetPaymentsByRolesAllowQuery,
    private getPaymentsQuery2: GetPaymentsQueryCpy,
    private getPaymentByIDQuery: GetPaymentByIDQuery,
    private createPaymentQuery: CreatePaymentQuery,
    private updatePaymentQuery: UpdatePaymentQuery,
    private deletePaymentQuery: DeletePaymentQuery,
    private blockPaymentQuery: BlockPaymentQuery,
    private unBlockPaymentQuery: UnBlockPaymentQuery,
    private logoutPaymentQuery: LogoutPaymentQuery,
    //private getRolesQry: GetRoles,
    private getRolesAllowByPaymentQuery: GetRolesAllowByPaymentQuery,
    private getRolesByIdQry: GetRolesById,
    private updatePasswordByAdministratorQuery: UpdatePasswordByAdministratorQuery,
    private changepwdPaymentQry: ChangePassPayment,
    private getPaymentQueryByName: GetPaymentByName,
    private activeQueryPayment: activeQueryPayment,
    private createPaymentsRolesQuery: CreatePaymentsRolesQuery,
    private getPaymentsRolesByPaymentIDQuery: GetPaymentsRolesByPaymentIDQuery,
    private deletePaymentsRolesQuery: DeletePaymentsRolesQuery,
    private createPaymentsAttributeQuery: CreatePaymentsAttributeQuery,
    private createPaymentsSecurityEntityQuery: CreatePaymentsSecurityEntityQuery,
    private deletePaymentsSecurityEntityQuery: DeletePaymentsSecurityEntityQuery,
    private deletePaymentsAttributeyQuery: DeletePaymentsAttributeQuery,
    private _httpClient: HttpClient,
  ) {
  }

  getPaymentByID(id: string): Observable<Response> {
    return this.getPaymentByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getPaymentByID));
  }

  getAllPayments(): Observable<Response> {
    return this.getPaymentsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getPayments));
  }

  getPaymentsByRolesAllow(): Observable<Response> {
    return this.getPaymentsByRolesAllowQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getPaymentsByRolesAllow));
  }

  getAllPayments2(): Observable<Response> {
    return this.getPaymentsQuery2.watch({}).valueChanges.pipe(map(({ data }: any) => data.getPayments));
  }



  updatePayment(Payment: Payment) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/payment/update';
    return this._httpClient.post(url,Payment).pipe(map((res) => res));
  }

  createPayment(Payment: Payment) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/payment/create';
    return this._httpClient.post(url,Payment).pipe(map((res) => res));
  }

  deletePayment(Payment: Payment) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/payment/delete';
    return this._httpClient.post(url,Payment).pipe(map((res) => res));
  }

  blockPayment(Payment: string): Observable<Response> {
    return this.blockPaymentQuery
      .mutate({
        id: Payment,
      })
      .pipe(map(({ data }: any) => data.blockPayment));
  }

  unblockPayment(Payment: string): Observable<Response> {
    return this.unBlockPaymentQuery
      .mutate({
        id: Payment,
      })
      .pipe(map(({ data }: any) => data.unblockPayment));
  }

  /*getRoles(): Observable<Response> {
    return this.getRolesQry.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }*/

  getRolesAllowByPayment(): Observable<Response> {
    return this.getRolesAllowByPaymentQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRolesAllowByPayment));
  }

  getRolesById(ide: string): Observable<Response> {
    return this.getRolesByIdQry
      .watch({
        id: ide,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getRoleByID));
  }

  updatePasswordByAdministrator(Payment: string, pass: string, passConfirm: string): Observable<Response> {
    return this.updatePasswordByAdministratorQuery
      .mutate({
        id: Payment,
        password: pass,
        Password_confirm: passConfirm,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByAdministrator));
  }

  changePassPayment(Payment: string, pass: string, passConfirm: string, passOld: string): Observable<Response> {
    return this.changepwdPaymentQry
      .mutate({
        id: Payment,
        password: pass,
        Password_confirm: passConfirm,
        Password_old: passOld,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByPayment));
  }

  getPaymentsRolesByPaymentID(id: string): Observable<Response> {
    return this.getPaymentsRolesByPaymentIDQuery
      .watch({
        Payment_id: id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getPaymentsRolesByPaymentID));
  }

  createPaymentRoles(PaymentRole: PaymentRole): Observable<Response> {
    return this.createPaymentsRolesQuery
      .mutate({
        req: { data: PaymentRole },
      })
      .pipe(map(({ data }: any) => data.createPaymentsRoles));
  }

  deletePaymentsRoles(id: string): Observable<Response> {
    return this.deletePaymentsRolesQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deletePaymentsRoles));
  }

  createPaymentsSecurityEntity(PaymentAttribute: NewPaymentSecurityEntity): Observable<Response> {
    return this.createPaymentsSecurityEntityQuery
      .mutate({
        request: { data: PaymentAttribute },
      })
      .pipe(map(({ data }: any) => data.createPaymentsSecurityEntity));
  }

  createPaymentsAttribute(PaymentAttribute: NewPaymentAttribute): Observable<Response> {
    return this.createPaymentsAttributeQuery
      .mutate({
        request: { data: PaymentAttribute },
      })
      .pipe(map(({ data }: any) => data.createPaymentsAttribute));
  }

  deletePaymentsSecurityEntity(id: string): Observable<Response> {
    return this.deletePaymentsSecurityEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deletePaymentsSecurityEntity));
  }

  deletePaymentsAttributey(id: string): Observable<Response> {
    return this.deletePaymentsAttributeyQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deletePaymentsAttribute));
  }

  validatePaymentPassword(password: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/password-policy';
    return this._httpClient.post(url, password).pipe(map((res) => res));
  }

  public getPaymentFormSesStorage(): any {
    let Payment: any;
    const token = sessionStorage.getItem('Token');
    if (token) {
      Payment = helper.decodeToken(token);
    }
    return Payment;
  }

  getPaymentByName(Payment: any): Observable<Response> {
    return this.getPaymentQueryByName
      .mutate(
        Payment
      )
      .pipe(map(({ data }: any) => data.getPaymentByName));
  }

  activePayment(id: string): Observable<Response> {
    return this.activeQueryPayment
      .mutate(
        {id}
      )
      .pipe(map(({ data }: any) => data.activePayment));
  }

  public getStudentsAll() {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/payments/all';
    return this._httpClient.get(url).pipe(map((res) => res));
  }
}
