export async function populateUsers(users: any[]): Promise<any[]> {
    try {

        const populatedUsers = await Promise.all(
            users.map(async (user) => {
                return await user.populate([
                    { path: 'Rol', },
                    { path: 'Dependencia' },
                    { path: 'Direccion_General' },
                    { path: 'Area' },
                    { path: 'Celula' },
                    { path: "Puesto" }
                ]);
            }),
        );

        return populatedUsers;
    } catch (error) {
        throw new Error(`Error al hacer populate: ${error}`);
    }
}