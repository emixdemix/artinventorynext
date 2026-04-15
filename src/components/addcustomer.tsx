import { useParams } from "next/navigation"
import { AddCustomerForm, EditCustomerForm } from "./forms"
import { useTranslation } from "react-i18next"
import { BackButton } from "./backbutton"


export const AddCustomer= () => {
   const { t } = useTranslation()
   const params = useParams(); const id = params?.id as string | undefined;

   return (
      <section className="edit">
         <BackButton text={t('general.backto.customers')} where="/customers" />
         <p className="breadcrumb">{id ? t('general.editcustomer') : t('general.addcustomer')}</p>
         {!id && <AddCustomerForm  /> }
         {id && <EditCustomerForm id={id}  /> }
      </section>
   )
}