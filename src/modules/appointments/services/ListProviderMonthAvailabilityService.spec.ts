import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const hourStart = 8;

    const firstDayAppointmentArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    await Promise.all(
      firstDayAppointmentArray.map(hour =>
        fakeAppointmentsRepository.create({
          provider_id: 'user',
          user_id: 'user',
          date: new Date(2020, 4, 25, hour, 0, 0),
        }),
      ),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 26, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 23, available: true },
        { day: 24, available: true },
        { day: 25, available: false },
        { day: 26, available: true },
        { day: 27, available: true },
        { day: 28, available: true },
      ]),
    );
  });
});
