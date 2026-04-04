import{z} from "zod"



export const dashboardQuerySchema=z.object({
    startDate:z.string().optional(),
    endDate:z.string().optional(),
    
})


export type DashboardQueryDto=z.infer<typeof dashboardQuerySchema>